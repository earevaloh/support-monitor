import { HttpClient } from "./HttpClient";

/**
 * Cliente HTTP específico para Jira Service Desk API
 */
export class JiraClient extends HttpClient {
    constructor() {
        // En desarrollo, usar el proxy de Vite para evitar CORS
        // En producción, usar la URL directa de Jira
        const isDevelopment = import.meta.env.DEV;
        const baseURL = isDevelopment
            ? "/api/jira" // Proxy local
            : import.meta.env.VITE_JIRA_BASE_URL || "";

        const email = import.meta.env.VITE_JIRA_EMAIL || "";
        const apiToken = import.meta.env.VITE_JIRA_API_TOKEN || "";

        // Crear el token de autenticación básica
        const auth = btoa(`${email}:${apiToken}`);

        super(baseURL, {
            headers: {
                Authorization: `Basic ${auth}`,
                Accept: "application/json",
                "Content-Type": "application/json",
                // Headers necesarios para evitar XSRF check failed
                "X-Atlassian-Token": "no-check",
                "X-Requested-With": "XMLHttpRequest",
            },
        });
    }

    /**
     * Realiza una búsqueda JQL usando el nuevo endpoint con paginación por tokens
     * Endpoint: /rest/api/3/search/jql
     */
    async searchWithToken<T>(
        jql: string,
        fields: string[] = ["*all"],
        maxResults = 100,
        nextPageToken?: string
    ): Promise<T> {
        const params = new URLSearchParams({
            jql,
            fields: fields.join(","),
            maxResults: maxResults.toString(),
        });

        if (nextPageToken) {
            params.append("nextPageToken", nextPageToken);
        }

        return this.get<T>(`/rest/api/3/search/jql?${params}`);
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
