import React, { useEffect } from "react";
import { useTicketsStore } from "@presentation/store/ticketsStore";
import { useSprintsStore } from "@presentation/store/sprintsStore";
import { KPIGrid } from "./kpis/KPIGrid";
import { Panel, Loader } from "rsuite";
import { toast } from "react-toastify";

/**
 * Componente principal del Dashboard
 */
export const Dashboard: React.FC = () => {
    const {
        tickets,
        loading: ticketsLoading,
        fetchTickets,
    } = useTicketsStore();
    const { activeSprint, fetchActiveSprint } = useSprintsStore();

    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchTickets(), fetchActiveSprint()]);
            } catch (error) {
                toast.error("Error al cargar datos del dashboard");
            }
        };

        loadData();
    }, [fetchTickets, fetchActiveSprint]);

    if (ticketsLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Loader size="lg" content="Cargando dashboard..." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Support Monitor
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Dashboard de métricas y KPIs de soporte
                        </p>
                    </div>

                    {activeSprint && (
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Sprint Activo
                            </p>
                            <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                                {activeSprint.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Panel bordered className="bg-white dark:bg-gray-800">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total Tickets
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {tickets.length}
                            </p>
                        </div>
                    </Panel>

                    <Panel bordered className="bg-white dark:bg-gray-800">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Abiertos</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {
                                    tickets.filter(
                                        (t) =>
                                            t.status === "open" ||
                                            t.status === "in_progress"
                                    ).length
                                }
                            </p>
                        </div>
                    </Panel>

                    <Panel bordered className="bg-white dark:bg-gray-800">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Resueltos</p>
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                                {
                                    tickets.filter(
                                        (t) =>
                                            t.status === "resolved" ||
                                            t.status === "closed"
                                    ).length
                                }
                            </p>
                        </div>
                    </Panel>

                    <Panel bordered className="bg-white dark:bg-gray-800">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Escalados</p>
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                                {tickets.filter((t) => t.escalated).length}
                            </p>
                        </div>
                    </Panel>
                </div>

                {/* KPIs Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        KPIs de Rendimiento
                    </h2>
                    <KPIGrid />
                </div>
            </div>
        </div>
    );
};
