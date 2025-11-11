import React from "react";

/**
 * Página de Reportes
 * Generación y visualización de reportes
 */
export const ReportsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Reportes
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Generación de reportes y análisis
                </p>
            </div>

            {/* Contenido de reportes - por implementar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-500 dark:text-gray-400">
                    Vista de reportes en desarrollo...
                </p>
            </div>
        </div>
    );
};
