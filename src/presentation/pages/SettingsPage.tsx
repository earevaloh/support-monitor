import React from "react";
import { useThemeStore } from "@presentation/store/themeStore";

/**
 * Página de Configuración
 * Ajustes de la aplicación, preferencias de usuario, etc.
 */
export const SettingsPage: React.FC = () => {
    const { sidebarMode, setSidebarMode } = useThemeStore();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Configuración
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Ajustes y preferencias de la aplicación
                </p>
            </div>

            {/* Configuración del Sidebar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Comportamiento del Menú
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Modo del Sidebar
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="fixed"
                                    checked={sidebarMode === "fixed"}
                                    onChange={() => setSidebarMode("fixed")}
                                    className="mr-2"
                                />
                                <span className="text-gray-700 dark:text-gray-300">
                                    Fijo - Siempre visible, colapsable con botón
                                </span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    value="hover"
                                    checked={sidebarMode === "hover"}
                                    onChange={() => setSidebarMode("hover")}
                                    className="mr-2"
                                />
                                <span className="text-gray-700 dark:text-gray-300">
                                    Hover - Se expande al pasar el mouse
                                </span>
                            </label>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                        En modo "Fijo", el sidebar permanece visible y puedes
                        colapsarlo manualmente. En modo "Hover", el sidebar se
                        expande automáticamente cuando pasas el mouse sobre él.
                    </p>
                </div>
            </div>

            {/* Otras configuraciones - por implementar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Conexión Jira
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Configuración de la integración con Jira en desarrollo...
                </p>
            </div>
        </div>
    );
};
