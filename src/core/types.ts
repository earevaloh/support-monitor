// Tipos de prioridad de tickets
export type Priority = "lowest" | "low" | "medium" | "high" | "highest";

// Tipos de estado de tickets
export type TicketStatus =
    | "open"
    | "in_progress"
    | "pending"
    | "resolved"
    | "closed";

// Tipos de KPI status
export type KPIStatus = "excellent" | "good" | "warning" | "critical";

// Tipo de categoría de KPI
export type KPICategory =
    | "FRT"
    | "TTR"
    | "SLA_COMPLIANCE"
    | "SLA_AVERAGE"
    | "FCR"
    | "FRRT"
    | "ESCALATIONS";

// Interfaz base para entidades
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Tipos de filtros
export interface DateRange {
    start: Date;
    end: Date;
}

export interface TicketFilters {
    status?: TicketStatus[];
    priority?: Priority[];
    assignee?: string[];
    dateRange?: DateRange;
    sprint?: string;
}
