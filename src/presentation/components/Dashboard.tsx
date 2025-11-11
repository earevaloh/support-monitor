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
            <div className="flex justify-center items-center h-screen">
                <Loader size="lg" content="Cargando dashboard..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Support Monitor
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Dashboard de métricas y KPIs de soporte
                        </p>
                    </div>

                    {activeSprint && (
                        <div className="text-right">
                            <p className="text-sm text-gray-500">
                                Sprint Activo
                            </p>
                            <p className="text-lg font-semibold text-primary-600">
                                {activeSprint.name}
                            </p>
                        </div>
                    )}
                </div>

                {/* Estadísticas rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Panel bordered className="bg-white">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                Total Tickets
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {tickets.length}
                            </p>
                        </div>
                    </Panel>

                    <Panel bordered className="bg-white">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Abiertos</p>
                            <p className="text-3xl font-bold text-blue-600">
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

                    <Panel bordered className="bg-white">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Resueltos</p>
                            <p className="text-3xl font-bold text-green-600">
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

                    <Panel bordered className="bg-white">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">Escalados</p>
                            <p className="text-3xl font-bold text-red-600">
                                {tickets.filter((t) => t.escalated).length}
                            </p>
                        </div>
                    </Panel>
                </div>

                {/* KPIs Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        KPIs de Rendimiento
                    </h2>
                    <KPIGrid />
                </div>
            </div>
        </div>
    );
};
