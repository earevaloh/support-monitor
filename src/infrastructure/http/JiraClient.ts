import { HttpClient } from "./HttpClient";

/**
 * Cliente HTTP específico para Jira Service Desk API
 */
export class JiraClient extends HttpClient {
    constructor() {
        const baseURL = import.meta.env.VITE_JIRA_BASE_URL || "";
        const email = import.meta.env.VITE_JIRA_EMAIL || "";
        const apiToken = import.meta.env.VITE_JIRA_API_TOKEN || "";

        // Crear el token de autenticación básica
        const auth = btoa(`${email}:${apiToken}`);

        super(baseURL, {
            headers: {
                Authorization: `Basic ${auth}`,
                Accept: "application/json",
            },
        });
    }

    /**
     * Realiza una búsqueda JQL en Jira
     */
    async search<T>(
        jql: string,
        fields: string[] = ["*all"],
        startAt = 0,
        maxResults = 50
    ): Promise<T> {
        return this.post<T>("/rest/api/3/search", {
            jql,
            fields,
            startAt,
            maxResults,
        });
    }

    /**
     * Obtiene un issue específico por su key
     */
    async getIssue<T>(
        issueKey: string,
        fields: string[] = ["*all"]
    ): Promise<T> {
        return this.get<T>(`/rest/api/3/issue/${issueKey}`, {
            params: { fields: fields.join(",") },
        });
    }

    /**
     * Obtiene información de un sprint
     */
    async getSprint<T>(sprintId: string): Promise<T> {
        return this.get<T>(`/rest/agile/1.0/sprint/${sprintId}`);
    }

    /**
     * Obtiene los sprints de un board
     */
    async getBoardSprints<T>(boardId: string): Promise<T> {
        return this.get<T>(`/rest/agile/1.0/board/${boardId}/sprint`);
    }
}
