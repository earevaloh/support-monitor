import { useEffect } from "react";
import { useThemeStore } from "@presentation/store/themeStore";

/**
 * Hook personalizado para gestionar el tema de la aplicación
 * Aplica la clase 'dark' al elemento html cuando el tema es oscuro
 */
export const useTheme = () => {
    const { theme, toggleTheme, setTheme } = useThemeStore();

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [theme]);

    return {
        theme,
        toggleTheme,
        setTheme,
        isDark: theme === "dark",
    };
};
