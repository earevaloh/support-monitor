import { Ticket } from "../entities/Ticket";
import { TicketFilters } from "../types";

/**
 * Caso de uso para filtrar tickets según criterios
 */
export class FilterTicketsUseCase {
    /**
     * Filtra tickets según los criterios proporcionados
     */
    execute(tickets: Ticket[], filters: TicketFilters): Ticket[] {
        let filteredTickets = [...tickets];

        // Filtrar por status
        if (filters.status && filters.status.length > 0) {
            filteredTickets = filteredTickets.filter((t) =>
                filters.status!.includes(t.status)
            );
        }

        // Filtrar por prioridad
        if (filters.priority && filters.priority.length > 0) {
            filteredTickets = filteredTickets.filter((t) =>
                filters.priority!.includes(t.priority)
            );
        }

        // Filtrar por assignee
        if (filters.assignee && filters.assignee.length > 0) {
            filteredTickets = filteredTickets.filter(
                (t) => t.assignee && filters.assignee!.includes(t.assignee.id)
            );
        }

        // Filtrar por rango de fechas
        if (filters.dateRange) {
            filteredTickets = filteredTickets.filter((t) => {
                const ticketDate = new Date(t.createdAt);
                return (
                    ticketDate >= filters.dateRange!.start &&
                    ticketDate <= filters.dateRange!.end
                );
            });
        }

        // Filtrar por sprint
        if (filters.sprint) {
            filteredTickets = filteredTickets.filter(
                (t) => t.sprint === filters.sprint
            );
        }

        return filteredTickets;
    }
}
