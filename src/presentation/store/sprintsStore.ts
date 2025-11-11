import { create } from "zustand";
import { Sprint } from "@core/entities/Sprint";
import { JiraSprintAdapter } from "@adapters/jira/JiraAdapter";
import { toast } from "react-toastify";

/**
 * Estado del store de sprints
 */
interface SprintsState {
    sprints: Sprint[];
    activeSprint: Sprint | null;
    loading: boolean;
    error: string | null;

    // Acciones
    fetchSprints: () => Promise<void>;
    fetchActiveSprint: () => Promise<void>;
    reset: () => void;
}

/**
 * Store de Zustand para gestionar sprints
 */
export const useSprintsStore = create<SprintsState>((set) => {
    const jiraSprintAdapter = new JiraSprintAdapter();

    return {
        sprints: [],
        activeSprint: null,
        loading: false,
        error: null,

        /**
         * Obtiene todos los sprints
         */
        fetchSprints: async () => {
            set({ loading: true, error: null });
            try {
                const sprints = await jiraSprintAdapter.getAll();
                set({
                    sprints,
                    loading: false,
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error al cargar sprints";
                set({ error: errorMessage, loading: false });
                toast.error(errorMessage);
            }
        },

        /**
         * Obtiene el sprint activo
         */
        fetchActiveSprint: async () => {
            set({ loading: true, error: null });
            try {
                const activeSprint = await jiraSprintAdapter.getActive();
                set({
                    activeSprint,
                    loading: false,
                });
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Error al cargar sprint activo";
                set({ error: errorMessage, loading: false });
                toast.error(errorMessage);
            }
        },

        /**
         * Resetea el store
         */
        reset: () => {
            set({
                sprints: [],
                activeSprint: null,
                loading: false,
                error: null,
            });
        },
    };
});
