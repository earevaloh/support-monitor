import { Ticket, TicketEntity, User } from "@core/entities/Ticket";
import { Sprint, SprintEntity } from "@core/entities/Sprint";
import { Priority, TicketStatus } from "@core/types";
import { JiraIssue, JiraUser, JiraSprint, JiraSprintResponse } from "./types";

/**
 * Mapper para convertir datos de Jira a entidades del dominio
 */
export class JiraMapper {
    /**
     * Mapea un issue de Jira a una entidad Ticket
     */
    static toTicket(jiraIssue: JiraIssue): Ticket {
        const fields = jiraIssue.fields;

        return new TicketEntity({
            id: jiraIssue.id,
            key: jiraIssue.key,
            summary: fields.summary,
            description: this.extractDescription(fields.description),
            status: this.mapStatus(fields.status.statusCategory.key),
            priority: this.mapPriority(fields.priority.name),
            assignee: fields.assignee
                ? this.mapUser(fields.assignee)
                : undefined,
            reporter: this.mapUser(fields.reporter),
            labels: fields.labels || [],
            sprint: this.extractSprintName(fields.customfield_10020),
            createdAt: new Date(fields.created),
            updatedAt: new Date(fields.updated),
            resolvedAt: fields.resolutiondate
                ? new Date(fields.resolutiondate)
                : undefined,

            // Calcular tiempos (en producción estos vendrían de campos customizados)
            firstResponseTime: this.calculateFRT(fields),
            resolutionTime: this.calculateResolutionTime(fields),

            // SLA (estos deberían venir de campos customizados de Jira)
            slaCompliance: this.calculateSLACompliance(fields),
            slaBreached: this.isSLABreached(fields),

            // Escalaciones
            escalated: this.isEscalated(fields),
            escalationCount: this.getEscalationCount(fields),

            // FCR
            resolvedOnFirstContact: this.isResolvedOnFirstContact(fields),

            customFields: this.extractCustomFields(fields),
        });
    }

    /**
     * Mapea un usuario de Jira a una entidad User
     */
    static mapUser(jiraUser: JiraUser): User {
        return {
            id: jiraUser.accountId,
            name: jiraUser.displayName,
            email: jiraUser.emailAddress || "",
            displayName: jiraUser.displayName,
            avatarUrl: jiraUser.avatarUrls?.["48x48"],
        };
    }

    /**
     * Mapea un sprint de Jira a una entidad Sprint
     */
    static toSprint(jiraSprint: JiraSprintResponse): Sprint {
        return new SprintEntity({
            id: jiraSprint.id.toString(),
            name: jiraSprint.name,
            startDate: jiraSprint.startDate
                ? new Date(jiraSprint.startDate)
                : new Date(),
            endDate: jiraSprint.endDate
                ? new Date(jiraSprint.endDate)
                : new Date(),
            goal: jiraSprint.goal,
            isActive: jiraSprint.state === "active",
            isClosed: jiraSprint.state === "closed",
        });
    }

    /**
     * Extrae la descripción del issue (puede ser string o objeto)
     */
    private static extractDescription(description: unknown): string {
        if (!description) return "";
        if (typeof description === "string") return description;
        
        // Si es un objeto de Jira (ADF format), extraer el texto
        if (typeof description === "object" && description !== null) {
            return this.parseADF(description);
        }
        
        return "";
    }

    /**
     * Parsea el formato ADF (Atlassian Document Format) a texto plano
     */
    private static parseADF(adf: unknown): string {
        if (!adf || typeof adf !== "object") return "";
        
        const adfDoc = adf as { content?: unknown[] };
        if (!adfDoc.content) return "";

        const extractText = (node: unknown): string => {
            if (!node || typeof node !== "object") return "";
            
            const n = node as { 
                text?: string; 
                content?: unknown[]; 
                type?: string 
            };

            // Si el nodo tiene texto directo
            if (n.text) {
                return n.text;
            }

            // Si el nodo tiene contenido, procesarlo recursivamente
            if (n.content && Array.isArray(n.content)) {
                return n.content
                    .map((child: unknown) => {
                        const text = extractText(child);
                        
                        // Agregar saltos de línea según el tipo de nodo
                        if (n.type === "paragraph" && text) {
                            return text + "\n";
                        }
                        if (n.type === "heading" && text) {
                            return text + "\n";
                        }
                        if (n.type === "listItem" && text) {
                            return "• " + text + "\n";
                        }
                        if (n.type === "codeBlock" && text) {
                            return "```\n" + text + "\n```\n";
                        }
                        
                        return text;
                    })
                    .join("");
            }

            return "";
        };

        return extractText(adfDoc).trim();
    }

    /**
     * Extrae el nombre del sprint del array de sprints
     */
    private static extractSprintName(
        sprints?: JiraSprint[]
    ): string | undefined {
        if (!sprints || sprints.length === 0) return undefined;
        // Retornar el sprint activo o el último
        const activeSprint = sprints.find((s) => s.state === "active");
        return activeSprint?.name || sprints[sprints.length - 1].name;
    }

    /**
     * Mapea el status de Jira a nuestro tipo
     */
    private static mapStatus(statusKey: string): TicketStatus {
        const statusMap: Record<string, TicketStatus> = {
            new: "open",
            indeterminate: "in_progress",
            done: "resolved",
        };
        return statusMap[statusKey.toLowerCase()] || "open";
    }

    /**
     * Mapea la prioridad de Jira a nuestro tipo
     */
    private static mapPriority(priorityName: string): Priority {
        const priorityMap: Record<string, Priority> = {
            lowest: "lowest",
            low: "low",
            medium: "medium",
            high: "high",
            highest: "highest",
        };
        return priorityMap[priorityName.toLowerCase()] || "medium";
    }

    /**
     * Calcula el First Response Time (simulado)
     * En producción esto vendría de un campo customizado o se calcularía con la API de comentarios
     */
    private static calculateFRT(
        fields: Record<string, unknown>
    ): number | undefined {
        // Simulación: retornar un valor aleatorio entre 10 y 240 minutos
        return Math.floor(Math.random() * 230) + 10;
    }

    /**
     * Calcula el tiempo de resolución
     */
    private static calculateResolutionTime(
        fields: Record<string, unknown>
    ): number | undefined {
        if (!fields.resolutiondate || !fields.created) return undefined;

        const created = new Date(fields.created as string);
        const resolved = new Date(fields.resolutiondate as string);
        const diffMs = resolved.getTime() - created.getTime();
        return Math.floor(diffMs / (1000 * 60)); // Convertir a minutos
    }

    /**
     * Calcula la calificación de SLA (simulado)
     */
    private static calculateSLACompliance(
        fields: Record<string, unknown>
    ): number {
        // En producción esto vendría de campos customizados de Jira
        return Math.floor(Math.random() * 2) + 3; // 3-5 estrellas
    }

    /**
     * Verifica si el SLA fue violado
     */
    private static isSLABreached(fields: Record<string, unknown>): boolean {
        // En producción esto vendría de campos customizados
        return Math.random() > 0.85; // 15% de probabilidad
    }

    /**
     * Verifica si el ticket fue escalado
     */
    private static isEscalated(fields: Record<string, unknown>): boolean {
        // En producción revisar labels o campos customizados
        const labels = (fields.labels as string[]) || [];
        return labels.some((l) => l.toLowerCase().includes("escalated"));
    }

    /**
     * Obtiene el conteo de escalaciones
     */
    private static getEscalationCount(fields: Record<string, unknown>): number {
        // En producción esto vendría de un campo customizado
        return this.isEscalated(fields) ? 1 : 0;
    }

    /**
     * Verifica si fue resuelto en primer contacto
     */
    private static isResolvedOnFirstContact(
        fields: Record<string, unknown>
    ): boolean {
        // En producción esto requeriría analizar el historial de comentarios
        return Math.random() > 0.5; // 50% de probabilidad para simulación
    }

    /**
     * Extrae campos customizados adicionales
     */
    private static extractCustomFields(
        fields: Record<string, unknown>
    ): Record<string, unknown> {
        const customFields: Record<string, unknown> = {};

        // Extraer campos customizados (customfield_*)
        Object.keys(fields).forEach((key) => {
            if (key.startsWith("customfield_")) {
                customFields[key] = fields[key];
            }
        });

        return customFields;
    }
}
