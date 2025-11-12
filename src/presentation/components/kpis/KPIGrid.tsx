import React, { useEffect } from "react";
import { useKPIStore } from "@presentation/store/kpiStore";
import { useTicketsStore } from "@presentation/store/ticketsStore";
import { KPICard } from "./KPICard";
import { Loader } from "rsuite";

/**
 * Componente que muestra la grid de KPIs
 */
export const KPIGrid: React.FC = () => {
    const { kpis, loading, calculateKPIs } = useKPIStore();
    const { filteredTickets } = useTicketsStore();

    useEffect(() => {
        if (filteredTickets.length > 0) {
            calculateKPIs(filteredTickets);
        }
    }, [filteredTickets, calculateKPIs]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader size="lg" content="Calculando KPIs..." />
            </div>
        );
    }

    if (kpis.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No hay datos disponibles para calcular KPIs</p>
                <p className="text-sm mt-2">
                    Carga tickets primero para ver los KPIs
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
            {kpis.map((kpi) => (
                <KPICard key={kpi.id} kpi={kpi} showTrend />
            ))}
        </div>
    );
};
