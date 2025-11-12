import { ITicketRepository } from "@core/repositories/ITicketRepository";
import { ISprintRepository } from "@core/repositories/ISprintRepository";
import { Ticket } from "@core/entities/Ticket";
import { Sprint, SprintEntity } from "@core/entities/Sprint";
import { TicketFilters } from "@core/types";
import { JiraClient } from "@infrastructure/http/JiraClient";
import { JiraMapper } from "./JiraMapper";
import { JiraSearchJqlResponse, JiraIssue } from "./types";

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
     * Obtiene todos los tickets del proyecto desde enero 2025
     * Usa el nuevo sistema de paginación con tokens de Jira Cloud
     */
    async getAll(): Promise<Ticket[]> {
        const jql = `project = ${this.projectKey} AND created >= "2025-01-01" ORDER BY created DESC`;
        let allTickets: Ticket[] = [];
        let nextPageToken: string | undefined = undefined;
        const maxResults = 100;
        let pageCount = 0;

        if (import.meta.env.DEV) {
            console.log(
                "🔍 Iniciando carga de tickets con paginación por tokens..."
            );
        }

        do {
            const response: JiraSearchJqlResponse =
                await this.client.searchWithToken<JiraSearchJqlResponse>(
                    jql,
                    ["*all"],
                    maxResults,
                    nextPageToken
                );

            // Verificar si la respuesta tiene la estructura correcta
            if (!response.issues || !Array.isArray(response.issues)) {
                console.error("❌ Error: response.issues es undefined o no es un array. Respuesta completa:", response);
                break;
            }

            const tickets = response.issues.map((issue: JiraIssue) =>
                JiraMapper.toTicket(issue as never)
            );
            allTickets = [...allTickets, ...tickets];
            pageCount++;

            if (import.meta.env.DEV) {
                console.log(
                    `📊 Página ${pageCount}: ${tickets.length} tickets | Total acumulado: ${allTickets.length}`
                );
            }

            nextPageToken = response.nextPageToken;
        } while (nextPageToken);

        if (import.meta.env.DEV) {
            console.log(
                `✅ Carga completa: ${allTickets.length} tickets obtenidos`
            );
        }

        return allTickets;
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
            if (import.meta.env.DEV) {
                console.error(`Error fetching ticket ${id}:`, error);
            }
            return null;
        }
    }

    /**
     * Obtiene tickets filtrados
     */
    async getFiltered(filters: TicketFilters): Promise<Ticket[]> {
        try {
            let jql = `project = ${this.projectKey}`;

            if (filters.sprint) jql += ` AND sprint = ${filters.sprint}`;
            if (filters.assignee && filters.assignee.length > 0) {
                jql += ` AND assignee IN (${filters.assignee
                    .map((a) => `"${a}"`)
                    .join(",")})`;
            }
            if (filters.status && filters.status.length > 0) {
                jql += ` AND status IN (${filters.status
                    .map((s) => `"${s}"`)
                    .join(",")})`;
            }
            if (filters.priority && filters.priority.length > 0) {
                jql += ` AND priority IN (${filters.priority
                    .map((p) => `"${p}"`)
                    .join(",")})`;
            }

            // Aplicar filtro de fecha: solo tickets desde 2025-01-01
            jql += ` AND created >= "2025-01-01"`;

            jql += " ORDER BY created DESC";

            console.log("Filtered JQL:", jql);

            let allTickets: Ticket[] = [];
            let nextPageToken: string | undefined = undefined;

            do {
                const response: JiraSearchJqlResponse =
                    await this.client.searchWithToken<JiraSearchJqlResponse>(
                        jql,
                        ["*all"],
                        100,
                        nextPageToken
                    );
                allTickets = [
                    ...allTickets,
                    ...response.issues.map((issue: JiraIssue) =>
                        JiraMapper.toTicket(issue as never)
                    ),
                ];
                nextPageToken = response.nextPageToken;
            } while (nextPageToken);

            return allTickets;
        } catch (error) {
            console.error("Error fetching filtered tickets:", error);
            return [];
        }
    }

    /**
     * Obtiene tickets por sprint
     * Nota: En Service Desk, esto obtiene tickets por período de tiempo
     * ya que Service Desk no usa sprints tradicionales
     */
    async getBySprint(_sprintId: string): Promise<Ticket[]> {
        try {
            const jql = `project = ${this.projectKey} ORDER BY created DESC`;
            console.log("Sprint JQL:", jql);

            let allTickets: Ticket[] = [];
            let nextPageToken: string | undefined = undefined;

            do {
                const response: JiraSearchJqlResponse =
                    await this.client.searchWithToken<JiraSearchJqlResponse>(
                        jql,
                        ["*all"],
                        100,
                        nextPageToken
                    );
                allTickets = [
                    ...allTickets,
                    ...response.issues.map((issue: JiraIssue) =>
                        JiraMapper.toTicket(issue as never)
                    ),
                ];
                nextPageToken = response.nextPageToken;
            } while (nextPageToken);

            return allTickets;
        } catch (error) {
            console.error("Error fetching sprint tickets:", error);
            return [];
        }
    }

    /**
     * Obtiene tickets por rango de fechas
     */
    async getByDateRange(start: Date, end: Date): Promise<Ticket[]> {
        try {
            const startDate = start.toISOString().split("T")[0];
            const endDate = end.toISOString().split("T")[0];
            const jql = `project = ${this.projectKey} AND created >= "${startDate}" AND created <= "${endDate}" ORDER BY created DESC`;
            console.log("Date Range JQL:", jql);

            let allTickets: Ticket[] = [];
            let nextPageToken: string | undefined = undefined;

            do {
                const response: JiraSearchJqlResponse =
                    await this.client.searchWithToken<JiraSearchJqlResponse>(
                        jql,
                        ["*all"],
                        100,
                        nextPageToken
                    );
                allTickets = [
                    ...allTickets,
                    ...response.issues.map((issue: JiraIssue) =>
                        JiraMapper.toTicket(issue as never)
                    ),
                ];
                nextPageToken = response.nextPageToken;
            } while (nextPageToken);

            return allTickets;
        } catch (error) {
            console.error("Error fetching tickets by date range:", error);
            return [];
        }
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
