import React, { useEffect, useState } from "react";
import { useTicketsStore } from "@presentation/store/ticketsStore";
import { useKPIStore } from "@presentation/store/kpiStore";
import { DateRangePicker } from "@presentation/components/DateRangePicker";
import { DateRange } from "rsuite/esm/DateRangePicker";
import {
    Panel,
    SelectPicker,
    Grid,
    Row,
    Col,
    Loader,
    Timeline,
    Badge,
    Divider,
} from "rsuite";
import { KPICard } from "@presentation/components/kpis/KPICard";
import {
    startOfWeek,
    endOfDay,
    format,
    isSameDay,
    startOfMonth,
    endOfMonth,
    subMonths,
    subWeeks,
} from "date-fns";
import { es } from "date-fns/locale";

/**
 * Página de KPIs
 * Vista detallada de todos los KPIs con gráficas e históricos
 */
export const KPIsPage: React.FC = () => {
    const {
        tickets,
        loading: ticketsLoading,
        fetchTicketsByDateRange,
    } = useTicketsStore();
    const { kpis, loading: kpisLoading, calculateKPIs } = useKPIStore();

    // Estado para el rango de fechas seleccionado
    const [dateRange, setDateRange] = useState<DateRange | null>(() => {
        const today = new Date();
        return [
            startOfWeek(today, { weekStartsOn: 1 }),
            endOfDay(today),
        ] as DateRange;
    });

    // Estado para filtro de categoría
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );

    // Cargar tickets cuando cambia el rango de fechas
    useEffect(() => {
        if (dateRange && dateRange[0] && dateRange[1]) {
            fetchTicketsByDateRange(dateRange[0], dateRange[1]);
        }
    }, [dateRange, fetchTicketsByDateRange]);

    // Calcular KPIs cuando cambian los tickets
    useEffect(() => {
        if (tickets.length > 0) {
            calculateKPIs(tickets);
        }
    }, [tickets, calculateKPIs]);

    // Función para obtener el texto del rango de fechas
    const getDateRangeText = (): string => {
        if (!dateRange || !dateRange[0] || !dateRange[1]) {
            return "Seleccionar período";
        }

        const start = dateRange[0];
        const end = dateRange[1];
        const today = new Date();

        const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        if (
            isSameDay(start, thisWeekStart) &&
            isSameDay(end, endOfDay(today))
        ) {
            return "Esta Semana";
        }

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

        const thisMonthStart = startOfMonth(today);
        if (
            isSameDay(start, thisMonthStart) &&
            isSameDay(end, endOfDay(today))
        ) {
            return "Este Mes";
        }

        const lastMonthStart = startOfMonth(subMonths(today, 1));
        const lastMonthEnd = endOfMonth(subMonths(today, 1));
        if (isSameDay(start, lastMonthStart) && isSameDay(end, lastMonthEnd)) {
            return "Mes Pasado";
        }

        return `${format(start, "dd/MMM", { locale: es })} - ${format(
            end,
            "dd/MMM",
            { locale: es }
        )}`;
    };

    // Opciones para el filtro de categoría
    const categoryOptions = [
        { label: "Todas las categorías", value: "all" },
        { label: "Tiempo Primera Respuesta", value: "FRT" },
        { label: "Tiempo Resolución", value: "TTR" },
        { label: "Cumplimiento SLA", value: "SLA_COMPLIANCE" },
        { label: "Promedio SLA", value: "SLA_AVERAGE" },
        { label: "First Contact Resolution", value: "FCR" },
        { label: "Escalaciones", value: "ESCALATIONS" },
    ];

    // Filtrar KPIs por categoría seleccionada
    const filteredKPIs =
        selectedCategory && selectedCategory !== "all"
            ? kpis.filter((kpi) => kpi.category === selectedCategory)
            : kpis;

    // Agrupar KPIs por estado
    const kpisByStatus = {
        excellent: filteredKPIs.filter((k) => k.status === "excellent"),
        good: filteredKPIs.filter((k) => k.status === "good"),
        warning: filteredKPIs.filter((k) => k.status === "warning"),
        critical: filteredKPIs.filter((k) => k.status === "critical"),
    };

    const loading = ticketsLoading || kpisLoading;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        KPIs de Soporte
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {getDateRangeText()} • {tickets.length} tickets
                        analizados
                    </p>
                </div>
                <DateRangePicker value={dateRange} onChange={setDateRange} />
            </div>

            {/* Filtros */}
            <Panel bordered className="bg-white dark:bg-gray-800">
                <Grid fluid>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Categoría
                            </label>
                            <SelectPicker
                                data={categoryOptions}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                placeholder="Filtrar por categoría"
                                block
                                cleanable
                            />
                        </Col>
                    </Row>
                </Grid>
            </Panel>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader size="lg" content="Calculando KPIs..." />
                </div>
            ) : filteredKPIs.length === 0 ? (
                <Panel bordered className="bg-white dark:bg-gray-800">
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>
                            No hay KPIs disponibles para el período seleccionado
                        </p>
                        <p className="text-sm mt-2">
                            Selecciona un rango de fechas con tickets
                        </p>
                    </div>
                </Panel>
            ) : (
                <>
                    {/* Resumen por estado */}
                    <Panel
                        bordered
                        className="bg-white dark:bg-gray-800"
                        header={
                            <h3 className="text-lg font-semibold">
                                Resumen de Estado
                            </h3>
                        }
                    >
                        <Grid fluid>
                            <Row gutter={16}>
                                <Col xs={12} sm={6}>
                                    <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                            {kpisByStatus.excellent.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Excelente
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                            {kpisByStatus.good.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Bueno
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                                        <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                            {kpisByStatus.warning.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Advertencia
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={12} sm={6}>
                                    <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                                        <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                                            {kpisByStatus.critical.length}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Crítico
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Grid>
                    </Panel>

                    {/* Grid de KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredKPIs.map((kpi) => (
                            <KPICard key={kpi.id} kpi={kpi} showTrend />
                        ))}
                    </div>

                    {/* Detalles de KPIs */}
                    <Panel
                        bordered
                        className="bg-white dark:bg-gray-800"
                        header={
                            <h3 className="text-lg font-semibold">
                                Detalles de KPIs
                            </h3>
                        }
                    >
                        <Timeline>
                            {filteredKPIs.map((kpi) => (
                                <Timeline.Item key={kpi.id}>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {kpi.name}
                                                </h4>
                                                <Badge
                                                    content={
                                                        kpi.status ===
                                                        "excellent"
                                                            ? "Excelente"
                                                            : kpi.status ===
                                                              "good"
                                                            ? "Bueno"
                                                            : kpi.status ===
                                                              "warning"
                                                            ? "Advertencia"
                                                            : "Crítico"
                                                    }
                                                    color={
                                                        kpi.status ===
                                                        "excellent"
                                                            ? "green"
                                                            : kpi.status ===
                                                              "good"
                                                            ? "blue"
                                                            : kpi.status ===
                                                              "warning"
                                                            ? "yellow"
                                                            : "red"
                                                    }
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                {kpi.description}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Valor actual:
                                                    </span>
                                                    <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                                                        {kpi.value.toFixed(2)}{" "}
                                                        {kpi.unit === "minutes"
                                                            ? "min"
                                                            : kpi.unit ===
                                                              "hours"
                                                            ? "hrs"
                                                            : kpi.unit ===
                                                              "percentage"
                                                            ? "%"
                                                            : ""}
                                                    </span>
                                                </div>
                                                {kpi.dataPoints && (
                                                    <div>
                                                        <span className="text-gray-500 dark:text-gray-400">
                                                            Puntos de datos:
                                                        </span>
                                                        <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                                                            {kpi.dataPoints}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            <Divider className="my-3" />
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                <div className="grid grid-cols-4 gap-2">
                                                    <div>
                                                        <span className="text-green-600 dark:text-green-400">
                                                            ● Excelente:
                                                        </span>{" "}
                                                        ≤{" "}
                                                        {
                                                            kpi.thresholds
                                                                .excellent
                                                        }
                                                    </div>
                                                    <div>
                                                        <span className="text-blue-600 dark:text-blue-400">
                                                            ● Bueno:
                                                        </span>{" "}
                                                        ≤ {kpi.thresholds.good}
                                                    </div>
                                                    <div>
                                                        <span className="text-yellow-600 dark:text-yellow-400">
                                                            ● Advertencia:
                                                        </span>{" "}
                                                        ≤{" "}
                                                        {kpi.thresholds.warning}
                                                    </div>
                                                    <div>
                                                        <span className="text-red-600 dark:text-red-400">
                                                            ● Crítico:
                                                        </span>{" "}
                                                        &gt;{" "}
                                                        {kpi.thresholds.warning}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {kpi.trend && (
                                            <div className="ml-4 text-right">
                                                <div
                                                    className={`text-sm font-medium ${
                                                        kpi.trend.direction ===
                                                        "up"
                                                            ? "text-red-600 dark:text-red-400"
                                                            : kpi.trend
                                                                  .direction ===
                                                              "down"
                                                            ? "text-green-600 dark:text-green-400"
                                                            : "text-gray-600 dark:text-gray-400"
                                                    }`}
                                                >
                                                    {kpi.trend.direction ===
                                                    "up"
                                                        ? "↑"
                                                        : kpi.trend
                                                              .direction ===
                                                          "down"
                                                        ? "↓"
                                                        : "→"}{" "}
                                                    {kpi.trend.percentage.toFixed(
                                                        1
                                                    )}
                                                    %
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {kpi.trend.direction ===
                                                    "up"
                                                        ? "En aumento"
                                                        : kpi.trend
                                                              .direction ===
                                                          "down"
                                                        ? "En descenso"
                                                        : "Estable"}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    </Panel>
                </>
            )}
        </div>
    );
};
