import { create } from "zustand";
import { KPI } from "@core/entities/KPI";
import { Ticket } from "@core/entities/Ticket";
import { CalculateKPIsUseCase } from "@core/useCases/CalculateKPIsUseCase";
import { toast } from "react-toastify";

/**
 * Estado del store de KPIs
 */
interface KPIState {
    kpis: KPI[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;

    // Acciones
    calculateKPIs: (tickets: Ticket[]) => void;
    reset: () => void;
}

/**
 * Store de Zustand para gestionar KPIs
 */
export const useKPIStore = create<KPIState>((set) => {
    const calculateKPIsUseCase = new CalculateKPIsUseCase();

    return {
        kpis: [],
        loading: false,
        error: null,
        lastUpdated: null,

        /**
         * Calcula los KPIs basándose en los tickets proporcionados
         */
        calculateKPIs: (tickets: Ticket[]) => {
            set({ loading: true, error: null });
            try {
                const kpis = calculateKPIsUseCase.execute(tickets);
                set({
                    kpis,
                    loading: false,
                    lastUpdated: new Date(),
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error al calcular KPIs";
                set({ error: errorMessage, loading: false });
                toast.error(errorMessage);
            }
        },

        /**
         * Resetea el store
         */
        reset: () => {
            set({
                kpis: [],
                loading: false,
                error: null,
                lastUpdated: null,
            });
        },
    };
});
