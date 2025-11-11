/**
 * Constantes de la aplicación
 */

// Estados de tickets
export const TICKET_STATUSES = {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    PENDING: "pending",
    RESOLVED: "resolved",
    CLOSED: "closed",
} as const;

// Prioridades
export const PRIORITIES = {
    LOWEST: "lowest",
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    HIGHEST: "highest",
} as const;

// Estados de KPI
export const KPI_STATUSES = {
    EXCELLENT: "excellent",
    GOOD: "good",
    WARNING: "warning",
    CRITICAL: "critical",
} as const;

// Categorías de KPI
export const KPI_CATEGORIES = {
    FRT: "FRT",
    TTR: "TTR",
    SLA_COMPLIANCE: "SLA_COMPLIANCE",
    SLA_AVERAGE: "SLA_AVERAGE",
    FCR: "FCR",
    FRRT: "FRRT",
    ESCALATIONS: "ESCALATIONS",
} as const;

// Colores para badges y estados
export const STATUS_COLORS = {
    [TICKET_STATUSES.OPEN]: "#2196f3",
    [TICKET_STATUSES.IN_PROGRESS]: "#00bcd4",
    [TICKET_STATUSES.PENDING]: "#ff9800",
    [TICKET_STATUSES.RESOLVED]: "#4caf50",
    [TICKET_STATUSES.CLOSED]: "#9e9e9e",
};

export const PRIORITY_COLORS = {
    [PRIORITIES.LOWEST]: "#4caf50",
    [PRIORITIES.LOW]: "#00bcd4",
    [PRIORITIES.MEDIUM]: "#2196f3",
    [PRIORITIES.HIGH]: "#ff9800",
    [PRIORITIES.HIGHEST]: "#f44336",
};

// Configuración de polling/refresh
export const REFRESH_INTERVALS = {
    TICKETS: 5 * 60 * 1000, // 5 minutos
    KPIS: 10 * 60 * 1000, // 10 minutos
    SPRINTS: 60 * 60 * 1000, // 1 hora
};
