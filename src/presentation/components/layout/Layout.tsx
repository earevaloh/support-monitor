import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useTheme } from "@presentation/hooks/useTheme";

/**
 * Interfaz para información del usuario
 */
interface User {
    name: string;
    email?: string;
    avatar?: string;
}

/**
 * Props del componente Layout
 */
interface LayoutProps {
    children: React.ReactNode;
    user?: User;
    activeMenuItem?: string;
    onNavigate?: (path: string) => void;
}

/**
 * Componente Layout principal
 * Compone Header + Sidebar + Content con soporte para tema light/dark
 */
export const Layout: React.FC<LayoutProps> = ({
    children,
    user,
    activeMenuItem,
    onNavigate,
}) => {
    // Inicializar el tema
    useTheme();

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Sidebar */}
            <Sidebar activeItem={activeMenuItem} onNavigate={onNavigate} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header user={user} />

                {/* Main content */}
                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
                    <div className="container mx-auto p-6">{children}</div>
                </main>
            </div>
        </div>
    );
};
