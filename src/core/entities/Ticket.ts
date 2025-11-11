import { BaseEntity, Priority, TicketStatus } from "../types";

/**
 * Entidad de Usuario del dominio
 * Representa un usuario del sistema (soporte, cliente, etc.)
 */
export interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    displayName: string;
}

/**
 * Entidad de Ticket del dominio
 * Representa un ticket de soporte en el sistema
 */
export interface Ticket extends BaseEntity {
    key: string; // Ej: "SUP-123"
    summary: string;
    description: string;
    status: TicketStatus;
    priority: Priority;
    assignee?: User;
    reporter: User;
    labels: string[];
    sprint?: string;

    // Tiempos y fechas
    firstResponseTime?: number; // en minutos
    resolutionTime?: number; // en minutos
    resolvedAt?: Date;

    // SLA
    slaCompliance: number; // 0-5 (estrellas)
    slaBreached: boolean;

    // Escalaciones
    escalated: boolean;
    escalationCount: number;

    // First Contact Resolution
    resolvedOnFirstContact: boolean;

    // Metadata adicional
    customFields: Record<string, unknown>;
}

/**
 * Clase para crear instancias de Ticket con valores por defecto
 */
export class TicketEntity implements Ticket {
    id: string;
    key: string;
    summary: string;
    description: string;
    status: TicketStatus;
    priority: Priority;
    assignee?: User;
    reporter: User;
    labels: string[];
    sprint?: string;
    createdAt: Date;
    updatedAt: Date;
    firstResponseTime?: number;
    resolutionTime?: number;
    resolvedAt?: Date;
    slaCompliance: number;
    slaBreached: boolean;
    escalated: boolean;
    escalationCount: number;
    resolvedOnFirstContact: boolean;
    customFields: Record<string, unknown>;

    constructor(
        data: Partial<Ticket> &
            Pick<Ticket, "id" | "key" | "summary" | "reporter">
    ) {
        this.id = data.id;
        this.key = data.key;
        this.summary = data.summary;
        this.description = data.description || "";
        this.status = data.status || "open";
        this.priority = data.priority || "medium";
        this.assignee = data.assignee;
        this.reporter = data.reporter;
        this.labels = data.labels || [];
        this.sprint = data.sprint;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
        this.firstResponseTime = data.firstResponseTime;
        this.resolutionTime = data.resolutionTime;
        this.resolvedAt = data.resolvedAt;
        this.slaCompliance = data.slaCompliance || 0;
        this.slaBreached = data.slaBreached || false;
        this.escalated = data.escalated || false;
        this.escalationCount = data.escalationCount || 0;
        this.resolvedOnFirstContact = data.resolvedOnFirstContact || false;
        this.customFields = data.customFields || {};
    }
}
