import { Ticket } from "../entities/Ticket";
import { TicketFilters } from "../types";

/**
 * Interfaz del repositorio de tickets
 * Define el contrato para obtener y gestionar tickets
 */
export interface ITicketRepository {
    /**
     * Obtiene todos los tickets
     */
    getAll(): Promise<Ticket[]>;

    /**
     * Obtiene un ticket por su ID
     */
    getById(id: string): Promise<Ticket | null>;

    /**
     * Obtiene tickets filtrados
     */
    getFiltered(filters: TicketFilters): Promise<Ticket[]>;

    /**
     * Obtiene tickets por sprint
     */
    getBySprint(sprintId: string): Promise<Ticket[]>;

    /**
     * Obtiene tickets por fecha
     */
    getByDateRange(start: Date, end: Date): Promise<Ticket[]>;
}
