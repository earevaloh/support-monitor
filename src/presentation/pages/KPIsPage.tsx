import React from "react";

/**
 * Página de KPIs
 * Vista detallada de todos los KPIs con gráficas e históricos
 */
export const KPIsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    KPIs
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Métricas e indicadores de rendimiento
                </p>
            </div>

            {/* Contenido de KPIs - por implementar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-500 dark:text-gray-400">
                    Vista detallada de KPIs en desarrollo...
                </p>
            </div>
        </div>
    );
};
