import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Estado del store de tema y preferencias de UI
 */
interface ThemeState {
    theme: "light" | "dark";
    sidebarCollapsed: boolean;
    sidebarMode: "fixed" | "hover";

    // Acciones
    toggleTheme: () => void;
    setTheme: (theme: "light" | "dark") => void;
    toggleSidebar: () => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setSidebarMode: (mode: "fixed" | "hover") => void;
}

/**
 * Store de Zustand para gestionar tema y preferencias de UI
 * Persiste en localStorage para mantener preferencias entre sesiones
 */
export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: "light",
            sidebarCollapsed: false,
            sidebarMode: "fixed",

            /**
             * Alterna entre tema light y dark
             */
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === "light" ? "dark" : "light",
                })),

            /**
             * Establece el tema específico
             */
            setTheme: (theme) => set({ theme }),

            /**
             * Alterna el estado collapsed del sidebar
             */
            toggleSidebar: () =>
                set((state) => ({
                    sidebarCollapsed: !state.sidebarCollapsed,
                })),

            /**
             * Establece el estado collapsed del sidebar
             */
            setSidebarCollapsed: (collapsed) =>
                set({ sidebarCollapsed: collapsed }),

            /**
             * Establece el modo del sidebar (fixed o hover)
             */
            setSidebarMode: (mode) => set({ sidebarMode: mode }),
        }),
        {
            name: "theme-storage",
        }
    )
);
