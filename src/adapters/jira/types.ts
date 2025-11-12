/**
 * Tipos de respuesta de la API de Jira
 */

export interface JiraIssue {
    id: string;
    key: string;
    fields: JiraIssueFields;
}

export interface JiraIssueFields {
    summary: string;
    description?: string | JiraDescription;
    status: JiraStatus;
    priority: JiraPriority;
    assignee?: JiraUser;
    reporter: JiraUser;
    created: string;
    updated: string;
    resolutiondate?: string;
    labels: string[];
    customfield_10020?: JiraSprint[]; // Sprint field
    customfield_10016?: number; // Story points
    [key: string]: unknown;
}

export interface JiraDescription {
    type: string;
    version: number;
    content: unknown[];
}

export interface JiraStatus {
    id: string;
    name: string;
    statusCategory: {
        id: number;
        key: string;
        colorName: string;
        name: string;
    };
}

export interface JiraPriority {
    id: string;
    name: string;
    iconUrl: string;
}

export interface JiraUser {
    accountId: string;
    displayName: string;
    emailAddress?: string;
    avatarUrls?: {
        "48x48": string;
    };
}

export interface JiraSprint {
    id: number;
    name: string;
    state: "active" | "future" | "closed";
    startDate?: string;
    endDate?: string;
    goal?: string;
}

// Respuesta del endpoint /rest/api/3/search/jql (nuevo con tokens)
export interface JiraSearchJqlResponse {
    issues: JiraIssue[];
    nextPageToken?: string; // Token para la siguiente página
}

// Respuesta del endpoint /rest/api/3/search (legacy, aún funciona)
export interface JiraSearchResponse {
    expand: string;
    startAt: number;
    maxResults: number;
    total: number;
    issues: JiraIssue[];
}

export interface JiraSprintResponse {
    id: number;
    self: string;
    state: string;
    name: string;
    startDate?: string;
    endDate?: string;
    completeDate?: string;
    originBoardId: number;
    goal?: string;
}

// Tipos para comentarios y actividad
export interface JiraComment {
    id: string;
    author: JiraUser;
    body: string | JiraDescription;
    created: string;
    updated: string;
    updateAuthor: JiraUser;
}

export interface JiraCommentsResponse {
    startAt: number;
    maxResults: number;
    total: number;
    comments: JiraComment[];
}
