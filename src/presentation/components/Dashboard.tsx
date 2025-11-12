import React, { useEffect, useState } from "react";
import { useTicketsStore } from "@presentation/store/ticketsStore";
import { KPIGrid } from "./kpis/KPIGrid";
import { DateRangePicker } from "./DateRangePicker";
import { Panel, Loader } from "rsuite";
import { DateRange } from "rsuite/esm/DateRangePicker";
import { toast } from "react-toastify";
import {
    startOfWeek,
    endOfDay,
    format,
    isSameDay,
    startOfMonth,
    endOfMonth,
    subMonths,
    subWeeks,
    startOfDay,
} from "date-fns";
import { es } from "date-fns/locale";

/**
 * Componente principal del Dashboard
 */
export const Dashboard: React.FC = () => {
    const {
        tickets,
        loading: ticketsLoading,
        fetchTickets,
        fetchTicketsByDateRange,
    } = useTicketsStore();

    // Estado para el rango de fechas seleccionado
    // Por defecto: Esta semana (lunes a hoy)
    const [dateRange, setDateRange] = useState<DateRange | null>(() => {
        const today = new Date();
        return [
            startOfWeek(today, { weekStartsOn: 1 }), // Lunes
            endOfDay(today), // Hoy al final del día
        ] as DateRange;
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                // Si hay un rango de fechas, cargar tickets por ese rango
                if (dateRange && dateRange[0] && dateRange[1]) {
                    await fetchTicketsByDateRange(dateRange[0], dateRange[1]);
                } else {
                    // Si no, cargar todos los tickets
                    await fetchTickets();
                }
            } catch (error) {
                toast.error("Error al cargar datos del dashboard");
            }
        };

        loadData();
    }, [dateRange, fetchTickets, fetchTicketsByDateRange]);

    // Manejador para cambio de rango de fechas
    const handleDateRangeChange = (value: DateRange | null) => {
        setDateRange(value);
    };

    // Función para obtener el texto del rango de fechas
    const getDateRangeText = (): string => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            return "Seleccionar período";
        }

        const start = dateRange[0];
        const end = dateRange[1];
        const today = new Date();

        // Esta Semana
        const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        if (
            isSameDay(start, thisWeekStart) &&
            isSameDay(end, endOfDay(today))
        ) {
            return "Esta Semana";
        }

        // Última Semana
        const lastWeekStart = startOfWeek(subWeeks(today, 1), {
            weekStartsOn: 1,
        });
        const lastWeekEnd = new Date(thisWeekStart.getTime() - 1);
        if (
            isSameDay(start, lastWeekStart) &&
            isSameDay(end, endOfDay(lastWeekEnd))
        ) {
            return "Última Semana";
        }

        // Este Mes
        const thisMonthStart = startOfMonth(today);
        if (
            isSameDay(start, thisMonthStart) &&
            isSameDay(end, endOfDay(today))
        ) {
            return "Este Mes";
        }

        // Mes Pasado
        const lastMonthStart = startOfMonth(subMonths(today, 1));
        const lastMonthEnd = endOfMonth(subMonths(today, 1));
        if (isSameDay(start, lastMonthStart) && isSameDay(end, lastMonthEnd)) {
            return "Mes Pasado";
        }

        // Todo
        const allTimeStart = startOfDay(new Date(2025, 0, 1));
        if (isSameDay(start, allTimeStart) && isSameDay(end, endOfDay(today))) {
            return "Todos los Tickets";
        }

        // Rango personalizado
        return `${format(start, "dd/MM/yyyy", { locale: es })} - ${format(
            end,
            "dd/MM/yyyy",
            { locale: es }
        )}`;
    };

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
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Support Monitor
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            {getDateRangeText()}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Período
                        </label>
                        <div className="w-full md:w-80">
                            <DateRangePicker
                                value={dateRange}
                                onChange={handleDateRangeChange}
                            />
                        </div>
                    </div>
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Abiertos
                            </p>
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Resueltos
                            </p>
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
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Escalados
                            </p>
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
