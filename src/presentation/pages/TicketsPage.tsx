import React from "react";

/**
 * Página de Tickets
 * Vista completa de la lista de tickets con filtros y búsqueda
 */
export const TicketsPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tickets
                </h1>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Gestión completa de tickets de soporte
                </p>
            </div>

            {/* Contenido de tickets - por implementar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <p className="text-gray-500 dark:text-gray-400">
                    Vista de tickets en desarrollo...
                </p>
            </div>
        </div>
    );
};
