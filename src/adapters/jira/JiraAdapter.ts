import { ITicketRepository } from "@core/repositories/ITicketRepository";
import { ISprintRepository } from "@core/repositories/ISprintRepository";
import { Ticket } from "@core/entities/Ticket";
import { Sprint, SprintEntity } from "@core/entities/Sprint";
import { TicketFilters } from "@core/types";
import { JiraClient } from "@infrastructure/http/JiraClient";
import { JiraMapper } from "./JiraMapper";
import { JiraSearchResponse } from "./types";

/**
 * Adaptador que implementa el repositorio de tickets usando la API de Jira Service Desk
 */
export class JiraTicketAdapter implements ITicketRepository {
    private client: JiraClient;
    private projectKey: string;

    constructor(projectKey?: string) {
        this.client = new JiraClient();
        // Usar el PROJECT_KEY del .env o el parámetro proporcionado
        this.projectKey =
            projectKey || import.meta.env.VITE_JIRA_PROJECT_KEY || "TIK";
    }

    /**
     * Obtiene todos los tickets del proyecto
     */
    async getAll(): Promise<Ticket[]> {
        const jql = `project = ${this.projectKey} ORDER BY created DESC`;
        const response = await this.client.search<JiraSearchResponse>(
            jql,
            ["*all"],
            0,
            100
        );
        return response.issues.map((issue) => JiraMapper.toTicket(issue));
    }

    /**
     * Obtiene un ticket por su ID
     */
    async getById(id: string): Promise<Ticket | null> {
        try {
            const response = await this.client.getIssue<{
                id: string;
                key: string;
                fields: unknown;
            }>(id);
            return JiraMapper.toTicket(response as never);
        } catch (error) {
            console.error(`Error fetching ticket ${id}:`, error);
            return null;
        }
    }

    /**
     * Obtiene tickets filtrados
     */
    async getFiltered(filters: TicketFilters): Promise<Ticket[]> {
        let jql = `project = ${this.projectKey}`;

        // Agregar filtros de status
        if (filters.status && filters.status.length > 0) {
            const statusFilters = filters.status.map((s) => `"${s}"`).join(",");
            jql += ` AND status IN (${statusFilters})`;
        }

        // Agregar filtros de prioridad
        if (filters.priority && filters.priority.length > 0) {
            const priorityFilters = filters.priority
                .map((p) => `"${p}"`)
                .join(",");
            jql += ` AND priority IN (${priorityFilters})`;
        }

        // Agregar filtro de assignee
        if (filters.assignee && filters.assignee.length > 0) {
            const assigneeFilters = filters.assignee
                .map((a) => `"${a}"`)
                .join(",");
            jql += ` AND assignee IN (${assigneeFilters})`;
        }

        // Agregar filtro de fechas
        if (filters.dateRange) {
            const startDate = filters.dateRange.start
                .toISOString()
                .split("T")[0];
            const endDate = filters.dateRange.end.toISOString().split("T")[0];
            jql += ` AND created >= "${startDate}" AND created <= "${endDate}"`;
        }

        jql += " ORDER BY created DESC";

        const response = await this.client.search<JiraSearchResponse>(
            jql,
            ["*all"],
            0,
            100
        );
        return response.issues.map((issue) => JiraMapper.toTicket(issue));
    }

    /**
     * Obtiene tickets por sprint
     * Nota: En Service Desk, esto obtiene tickets por período de tiempo
     * ya que Service Desk no usa sprints tradicionales
     */
    async getBySprint(_sprintId: string): Promise<Ticket[]> {
        // En Service Desk, interpretamos el sprintId como un rango de fechas
        // Por ahora, retornamos los tickets más recientes
        const jql = `project = ${this.projectKey} ORDER BY created DESC`;
        const response = await this.client.search<JiraSearchResponse>(
            jql,
            ["*all"],
            0,
            100
        );
        return response.issues.map((issue) => JiraMapper.toTicket(issue));
    }

    /**
     * Obtiene tickets por rango de fechas
     */
    async getByDateRange(start: Date, end: Date): Promise<Ticket[]> {
        const startDate = start.toISOString().split("T")[0];
        const endDate = end.toISOString().split("T")[0];
        const jql = `project = ${this.projectKey} AND created >= "${startDate}" AND created <= "${endDate}" ORDER BY created DESC`;
        const response = await this.client.search<JiraSearchResponse>(
            jql,
            ["*all"],
            0,
            100
        );
        return response.issues.map((issue) => JiraMapper.toTicket(issue));
    }
}

/**
 * Adaptador que implementa el repositorio de sprints para Jira Service Desk
 * Nota: Service Desk no usa sprints tradicionales, por lo que creamos
 * "períodos virtuales" basados en semanas/meses para análisis de tendencias
 */
export class JiraSprintAdapter implements ISprintRepository {
    constructor() {
        // Service Desk no requiere cliente para sprints virtuales
    }

    /**
     * Obtiene "sprints" virtuales (períodos de tiempo)
     * En Service Desk, creamos períodos semanales/mensuales para análisis
     */
    async getAll(): Promise<Sprint[]> {
        // Crear períodos virtuales de las últimas 4 semanas
        const sprints: Sprint[] = [];
        const now = new Date();

        for (let i = 0; i < 4; i++) {
            const endDate = new Date(now);
            endDate.setDate(endDate.getDate() - i * 7);

            const startDate = new Date(endDate);
            startDate.setDate(startDate.getDate() - 7);

            sprints.push(
                new SprintEntity({
                    id: `week-${i}`,
                    name: `Semana ${i === 0 ? "Actual" : `Hace ${i}`}`,
                    startDate,
                    endDate,
                })
            );
        }

        return sprints;
    }

    /**
     * Obtiene el período activo actual (semana actual)
     */
    async getActive(): Promise<Sprint | null> {
        const sprints = await this.getAll();
        return sprints.find((s) => s.isActive) || null;
    }

    /**
     * Obtiene un período por su ID
     */
    async getById(id: string): Promise<Sprint | null> {
        const sprints = await this.getAll();
        return sprints.find((s) => s.id === id) || null;
    }

    /**
     * Obtiene períodos cerrados recientes
     */
    async getRecentClosed(limit: number): Promise<Sprint[]> {
        const sprints = await this.getAll();
        return sprints.filter((s) => s.isClosed).slice(0, limit);
    }
}
