import React, { useState } from "react";
import { useThemeStore } from "@presentation/store/themeStore";
import { useTicketsStore } from "@presentation/store/ticketsStore";

/**
 * Interfaz para items del menú
 */
interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string;
    badge?: number;
}

/**
 * Props del componente Sidebar
 */
interface SidebarProps {
    activeItem?: string;
    onNavigate?: (path: string) => void;
}

/**
 * Componente Sidebar
 * Sidebar colapsable con soporte para modo fixed y hover
 */
export const Sidebar: React.FC<SidebarProps> = ({
    activeItem = "dashboard",
    onNavigate,
}) => {
    const { sidebarCollapsed, sidebarMode } = useThemeStore();
    const { tickets } = useTicketsStore();
    const [isHovered, setIsHovered] = useState(false);

    // Determinar si el sidebar debe estar expandido
    const isExpanded = sidebarMode === "hover" ? isHovered : !sidebarCollapsed;

    // Calcular tickets activos (no resueltos ni cerrados)
    const activeTicketsCount = tickets.filter(
        (ticket) =>
            ticket.status !== "resolved" &&
            ticket.status !== "closed"
    ).length;

    // Items del menú
    const menuItems: MenuItem[] = [
        {
            id: "dashboard",
            label: "Dashboard",
            path: "/",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
        },
        {
            id: "tickets",
            label: "Tickets",
            path: "/tickets",
            badge: activeTicketsCount,
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            ),
        },
        {
            id: "kpis",
            label: "KPIs",
            path: "/kpis",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                </svg>
            ),
        },
        {
            id: "reports",
            label: "Reportes",
            path: "/reports",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
        },
        {
            id: "settings",
            label: "Configuración",
            path: "/settings",
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
        },
    ];

    const handleItemClick = (item: MenuItem) => {
        onNavigate?.(item.path);
    };

    return (
        <aside
            className={`
        ${isExpanded ? "w-60" : "w-16"}
        ${
            sidebarMode === "hover" && isHovered
                ? "fixed z-50 h-screen shadow-lg"
                : "relative"
        }
        bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700
        transition-all duration-300 ease-in-out
        flex flex-col
      `}
            onMouseEnter={() => sidebarMode === "hover" && setIsHovered(true)}
            onMouseLeave={() => sidebarMode === "hover" && setIsHovered(false)}
        >
            {/* Sidebar content */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <div key={item.id} className="relative">
                        <button
                            onClick={() => handleItemClick(item)}
                            className={`
                w-full flex items-center space-x-3 px-3 py-3 rounded-lg
                transition-colors duration-200
                ${
                    activeItem === item.id
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
                            title={!isExpanded ? item.label : undefined}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>

                            {isExpanded && (
                                <>
                                    <span className="flex-1 text-left font-medium">
                                        {item.label}
                                    </span>

                                    {item.badge !== undefined &&
                                        item.badge > 0 && (
                                            <span className="flex-shrink-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                                                {item.badge}
                                            </span>
                                        )}
                                </>
                            )}
                        </button>

                        {/* Tooltip para modo colapsado */}
                        {!isExpanded && sidebarMode === "fixed" && (
                            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap z-50">
                                {item.label}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="ml-2 text-red-400">
                                        ({item.badge})
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </nav>

            {/* Sidebar footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                {isExpanded ? (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        <p>Support Monitor</p>
                        <p className="mt-1">v1.0.0</p>
                    </div>
                ) : (
                    <div className="w-full h-8 flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                )}
            </div>
        </aside>
    );
};
