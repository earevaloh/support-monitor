import { ITicketRepository } from "../repositories/ITicketRepository";
import { Ticket } from "../entities/Ticket";
import { TicketFilters } from "../types";

/**
 * Caso de uso para obtener tickets del repositorio
 */
export class GetTicketsUseCase {
    constructor(private ticketRepository: ITicketRepository) {}

    /**
     * Obtiene todos los tickets
     */
    async execute(): Promise<Ticket[]> {
        return await this.ticketRepository.getAll();
    }

    /**
     * Obtiene un ticket por ID
     */
    async executeById(id: string): Promise<Ticket | null> {
        return await this.ticketRepository.getById(id);
    }

    /**
     * Obtiene tickets filtrados
     */
    async executeWithFilters(filters: TicketFilters): Promise<Ticket[]> {
        return await this.ticketRepository.getFiltered(filters);
    }

    /**
     * Obtiene tickets por sprint
     */
    async executeBySprint(sprintId: string): Promise<Ticket[]> {
        return await this.ticketRepository.getBySprint(sprintId);
    }

    /**
     * Obtiene tickets por rango de fechas
     */
    async executeByDateRange(start: Date, end: Date): Promise<Ticket[]> {
        return await this.ticketRepository.getByDateRange(start, end);
    }
}
