import { create } from "zustand";
import { Ticket } from "@core/entities/Ticket";
import { TicketFilters } from "@core/types";
import { JiraTicketAdapter } from "@adapters/jira/JiraAdapter";
import { GetTicketsUseCase } from "@core/useCases/GetTicketsUseCase";
import { FilterTicketsUseCase } from "@core/useCases/FilterTicketsUseCase";
import { toast } from "react-toastify";

/**
 * Estado del store de tickets
 */
interface TicketsState {
    tickets: Ticket[];
    filteredTickets: Ticket[];
    loading: boolean;
    error: string | null;
    filters: TicketFilters;

    // Acciones
    fetchTickets: () => Promise<void>;
    fetchTicketsBySprint: (sprintId: string) => Promise<void>;
    fetchTicketsByDateRange: (start: Date, end: Date) => Promise<void>;
    setFilters: (filters: TicketFilters) => void;
    applyFilters: () => void;
    clearFilters: () => void;
    reset: () => void;
}

/**
 * Store de Zustand para gestionar tickets
 */
export const useTicketsStore = create<TicketsState>((set, get) => {
    const jiraAdapter = new JiraTicketAdapter();
    const getTicketsUseCase = new GetTicketsUseCase(jiraAdapter);
    const filterTicketsUseCase = new FilterTicketsUseCase();

    return {
        tickets: [],
        filteredTickets: [],
        loading: false,
        error: null,
        filters: {},

        /**
         * Obtiene todos los tickets
         */
        fetchTickets: async () => {
            set({ loading: true, error: null });
            try {
                const tickets = await getTicketsUseCase.execute();
                set({
                    tickets,
                    filteredTickets: tickets,
                    loading: false,
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error al cargar tickets";
                set({ error: errorMessage, loading: false });
                toast.error(errorMessage);
            }
        },

        /**
         * Obtiene tickets por sprint
         */
        fetchTicketsBySprint: async (sprintId: string) => {
            set({ loading: true, error: null });
            try {
                const tickets = await getTicketsUseCase.executeBySprint(
                    sprintId
                );
                set({
                    tickets,
                    filteredTickets: tickets,
                    loading: false,
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error al cargar tickets del sprint";
                set({ error: errorMessage, loading: false });
                toast.error(errorMessage);
            }
        },

        /**
         * Obtiene tickets por rango de fechas
         */
        fetchTicketsByDateRange: async (start: Date, end: Date) => {
            set({ loading: true, error: null });
            try {
                const tickets = await getTicketsUseCase.executeByDateRange(
                    start,
                    end
                );
                set({
                    tickets,
                    filteredTickets: tickets,
                    loading: false,
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error al cargar tickets por fecha";
                set({ error: errorMessage, loading: false });
                toast.error(errorMessage);
            }
        },

        /**
         * Establece los filtros
         */
        setFilters: (filters: TicketFilters) => {
            set({ filters });
        },

        /**
         * Aplica los filtros a los tickets
         */
        applyFilters: () => {
            const { tickets, filters } = get();
            const filteredTickets = filterTicketsUseCase.execute(
                tickets,
                filters
            );
            set({ filteredTickets });
        },

        /**
         * Limpia los filtros
         */
        clearFilters: () => {
            const { tickets } = get();
            set({
                filters: {},
                filteredTickets: tickets,
            });
        },

        /**
         * Resetea el store
         */
        reset: () => {
            set({
                tickets: [],
                filteredTickets: [],
                loading: false,
                error: null,
                filters: {},
            });
        },
    };
});
