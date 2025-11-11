import React from "react";
import { useTheme } from "@presentation/hooks/useTheme";
import { useThemeStore } from "@presentation/store/themeStore";

/**
 * Interfaz para información del usuario
 */
interface User {
    name: string;
    email?: string;
    avatar?: string;
}

/**
 * Props del componente Header
 */
interface HeaderProps {
    user?: User;
    onToggleSidebar?: () => void;
}

/**
 * Componente Header
 * Incluye logo/título, toggle de sidebar, toggle de tema, y menú de usuario
 */
export const Header: React.FC<HeaderProps> = ({ user, onToggleSidebar }) => {
    const { theme, toggleTheme } = useTheme();
    const { toggleSidebar } = useThemeStore();

    const handleToggleSidebar = () => {
        toggleSidebar();
        onToggleSidebar?.();
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 flex items-center justify-between sticky top-0 z-40 transition-colors duration-200">
            {/* Left side: Menu toggle + Logo/Title */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleToggleSidebar}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Toggle sidebar"
                >
                    <svg
                        className="w-6 h-6 text-gray-600 dark:text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Logo/Title - Espacio preparado para logo futuro */}
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">SM</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                        Support Monitor
                    </h1>
                </div>
            </div>

            {/* Right side: Theme toggle + User menu */}
            <div className="flex items-center space-x-4">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Switch to ${
                        theme === "light" ? "dark" : "light"
                    } mode`}
                >
                    {theme === "light" ? (
                        // Moon icon for dark mode
                        <svg
                            className="w-6 h-6 text-gray-600 dark:text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                            />
                        </svg>
                    ) : (
                        // Sun icon for light mode
                        <svg
                            className="w-6 h-6 text-gray-600 dark:text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    )}
                </button>

                {/* User menu - Preparado para autenticación futura */}
                <div className="flex items-center space-x-3">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name || "Usuario"}
                        </p>
                        {user?.email && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {user.email}
                            </p>
                        )}
                    </div>

                    <button
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold hover:shadow-lg transition-shadow"
                        aria-label="User menu"
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-sm">
                                {user?.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};
