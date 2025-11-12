import React, { useEffect, useState } from "react";
import { useTicketsStore } from "@presentation/store/ticketsStore";
import { useKPIStore } from "@presentation/store/kpiStore";
import { DateRangePicker } from "@presentation/components/DateRangePicker";
import { DateRange } from "rsuite/esm/DateRangePicker";
import {
    Panel,
    ButtonToolbar,
    Grid,
    Row,
    Col,
    Loader,
    Table,
    Badge,
    SelectPicker,
    Divider,
    IconButton,
    Tooltip,
    Whisper,
} from "rsuite";
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
import FileDownloadIcon from "@rsuite/icons/FileDownload";
import TableIcon from "@rsuite/icons/Table";
import PieChartIcon from "@rsuite/icons/PieChart";
import PageIcon from "@rsuite/icons/Page";
import { Ticket } from "@core/entities/Ticket";

const { Column, HeaderCell, Cell } = Table;

/**
 * Página de Reportes
 * Generación y visualización de reportes
 */
export const ReportsPage: React.FC = () => {
    const {
        tickets,
        loading: ticketsLoading,
        fetchTicketsByDateRange,
    } = useTicketsStore();
    const { kpis, calculateKPIs } = useKPIStore();

    // Estado para el rango de fechas
    const [dateRange, setDateRange] = useState<DateRange | null>(() => {
        const today = new Date();
        return [
            startOfWeek(today, { weekStartsOn: 1 }),
            endOfDay(today),
        ] as DateRange;
    });

    // Estado para tipo de reporte seleccionado
    const [reportType, setReportType] = useState<string>("summary");

    // Cargar datos cuando cambia el rango de fechas
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

    // Opciones de tipos de reporte
    const reportTypeOptions = [
        { label: "Resumen Ejecutivo", value: "summary" },
        { label: "Detalle de Tickets", value: "tickets" },
        { label: "Reporte de KPIs", value: "kpis" },
        { label: "Análisis por Estado", value: "by_status" },
        { label: "Análisis por Prioridad", value: "by_priority" },
        { label: "Análisis por Asignado", value: "by_assignee" },
    ];

    // Calcular estadísticas
    const stats = {
        total: tickets.length,
        byStatus: {
            open: tickets.filter((t) => t.status === "open").length,
            in_progress: tickets.filter((t) => t.status === "in_progress")
                .length,
            pending: tickets.filter((t) => t.status === "pending").length,
            resolved: tickets.filter((t) => t.status === "resolved").length,
            closed: tickets.filter((t) => t.status === "closed").length,
        },
        byPriority: {
            highest: tickets.filter((t) => t.priority === "highest").length,
            high: tickets.filter((t) => t.priority === "high").length,
            medium: tickets.filter((t) => t.priority === "medium").length,
            low: tickets.filter((t) => t.priority === "low").length,
            lowest: tickets.filter((t) => t.priority === "lowest").length,
        },
        slaBreached: tickets.filter((t) => t.slaBreached).length,
        escalated: tickets.filter((t) => t.escalated).length,
        firstContactResolution: tickets.filter((t) => t.resolvedOnFirstContact)
            .length,
    };

    // Función para exportar a CSV
    const exportToCSV = () => {
        if (tickets.length === 0) return;

        const headers = [
            "ID",
            "Título",
            "Estado",
            "Prioridad",
            "Asignado",
            "Reportado por",
            "Fecha Creación",
            "Fecha Actualización",
            "SLA Vencido",
            "Escalado",
        ];

        const rows = tickets.map((ticket) => [
            ticket.key,
            `"${ticket.summary.replace(/"/g, '""')}"`,
            ticket.status,
            ticket.priority,
            ticket.assignee?.name || "Sin asignar",
            ticket.reporter.name,
            format(ticket.createdAt, "yyyy-MM-dd HH:mm"),
            format(ticket.updatedAt, "yyyy-MM-dd HH:mm"),
            ticket.slaBreached ? "Sí" : "No",
            ticket.escalated ? "Sí" : "No",
        ]);

        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
            "\n"
        );

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `reporte_tickets_${format(new Date(), "yyyy-MM-dd")}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Función para exportar KPIs a CSV
    const exportKPIsToCSV = () => {
        if (kpis.length === 0) return;

        const headers = ["KPI", "Valor", "Unidad", "Estado", "Descripción"];

        const rows = kpis.map((kpi) => [
            kpi.name,
            kpi.value.toFixed(2),
            kpi.unit,
            kpi.status,
            `"${kpi.description.replace(/"/g, '""')}"`,
        ]);

        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
            "\n"
        );

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            `reporte_kpis_${format(new Date(), "yyyy-MM-dd")}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Función para imprimir reporte
    const printReport = () => {
        window.print();
    };

    const statusLabels: Record<string, string> = {
        open: "Abierto",
        in_progress: "En Progreso",
        pending: "Pendiente",
        resolved: "Resuelto",
        closed: "Cerrado",
    };

    const priorityLabels: Record<string, string> = {
        lowest: "Más Bajo",
        low: "Bajo",
        medium: "Medio",
        high: "Alto",
        highest: "Más Alto",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Reportes de Soporte
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {getDateRangeText()} • {tickets.length} tickets
                    </p>
                </div>
                <div className="flex gap-3">
                    <DateRangePicker
                        value={dateRange}
                        onChange={setDateRange}
                    />
                </div>
            </div>

            {/* Controles de Reporte */}
            <Panel bordered className="bg-white dark:bg-gray-800">
                <Grid fluid>
                    <Row gutter={16} className="items-end">
                        <Col xs={24} sm={12} md={10}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tipo de Reporte
                            </label>
                            <SelectPicker
                                data={reportTypeOptions}
                                value={reportType}
                                onChange={(value) =>
                                    setReportType(value || "summary")
                                }
                                placeholder="Seleccionar tipo"
                                block
                                searchable={false}
                            />
                        </Col>
                        <Col xs={24} sm={12} md={14}>
                            <ButtonToolbar className="flex justify-end gap-2">
                                <Whisper
                                    speaker={
                                        <Tooltip>
                                            Exportar Tickets a CSV
                                        </Tooltip>
                                    }
                                >
                                    <IconButton
                                        icon={<FileDownloadIcon />}
                                        appearance="primary"
                                        color="green"
                                        onClick={exportToCSV}
                                        disabled={tickets.length === 0}
                                    >
                                        Exportar Tickets
                                    </IconButton>
                                </Whisper>
                                <Whisper
                                    speaker={
                                        <Tooltip>Exportar KPIs a CSV</Tooltip>
                                    }
                                >
                                    <IconButton
                                        icon={<TableIcon />}
                                        appearance="primary"
                                        color="blue"
                                        onClick={exportKPIsToCSV}
                                        disabled={kpis.length === 0}
                                    >
                                        Exportar KPIs
                                    </IconButton>
                                </Whisper>
                                <Whisper
                                    speaker={
                                        <Tooltip>Imprimir Reporte</Tooltip>
                                    }
                                >
                                    <IconButton
                                        icon={<PageIcon />}
                                        appearance="ghost"
                                        onClick={printReport}
                                    >
                                        Imprimir
                                    </IconButton>
                                </Whisper>
                            </ButtonToolbar>
                        </Col>
                    </Row>
                </Grid>
            </Panel>

            {ticketsLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader size="lg" content="Cargando datos..." />
                </div>
            ) : tickets.length === 0 ? (
                <Panel bordered className="bg-white dark:bg-gray-800">
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <p>
                            No hay datos disponibles para el período
                            seleccionado
                        </p>
                        <p className="text-sm mt-2">
                            Selecciona un rango de fechas diferente
                        </p>
                    </div>
                </Panel>
            ) : (
                <>
                    {/* Resumen Ejecutivo */}
                    {reportType === "summary" && (
                        <>
                            <Panel
                                bordered
                                className="bg-white dark:bg-gray-800"
                                header={
                                    <h3 className="text-lg font-semibold">
                                        Resumen Ejecutivo
                                    </h3>
                                }
                            >
                                <Grid fluid>
                                    <Row gutter={16} className="mb-6">
                                        <Col xs={24} sm={12} md={6}>
                                            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                                    {stats.total}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Total Tickets
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                                                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                                                    {stats.byStatus.resolved +
                                                        stats.byStatus.closed}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Resueltos/Cerrados
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                                                <div className="text-4xl font-bold text-red-600 dark:text-red-400">
                                                    {stats.slaBreached}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    SLA Vencidos
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xs={24} sm={12} md={6}>
                                            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                                                <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                                                    {stats.escalated}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Escalados
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                    <Divider />

                                    <Row gutter={16}>
                                        <Col xs={24} md={12}>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Distribución por Estado
                                            </h4>
                                            <div className="space-y-3">
                                                {Object.entries(
                                                    stats.byStatus
                                                ).map(([status, count]) => (
                                                    <div
                                                        key={status}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {
                                                                statusLabels[
                                                                    status
                                                                ]
                                                            }
                                                        </span>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                                <div
                                                                    className="bg-blue-600 h-2 rounded-full"
                                                                    style={{
                                                                        width: `${
                                                                            (count /
                                                                                stats.total) *
                                                                            100
                                                                        }%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="font-semibold text-gray-900 dark:text-gray-100 w-12 text-right">
                                                                {count}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                Distribución por Prioridad
                                            </h4>
                                            <div className="space-y-3">
                                                {Object.entries(
                                                    stats.byPriority
                                                ).map(([priority, count]) => (
                                                    <div
                                                        key={priority}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {
                                                                priorityLabels[
                                                                    priority
                                                                ]
                                                            }
                                                        </span>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${
                                                                        priority ===
                                                                            "highest" ||
                                                                        priority ===
                                                                            "high"
                                                                            ? "bg-red-600"
                                                                            : priority ===
                                                                              "medium"
                                                                            ? "bg-yellow-600"
                                                                            : "bg-green-600"
                                                                    }`}
                                                                    style={{
                                                                        width: `${
                                                                            (count /
                                                                                stats.total) *
                                                                            100
                                                                        }%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="font-semibold text-gray-900 dark:text-gray-100 w-12 text-right">
                                                                {count}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Panel>

                            {/* KPIs Principales */}
                            {kpis.length > 0 && (
                                <Panel
                                    bordered
                                    className="bg-white dark:bg-gray-800"
                                    header={
                                        <h3 className="text-lg font-semibold">
                                            KPIs Principales
                                        </h3>
                                    }
                                >
                                    <Grid fluid>
                                        <Row gutter={16}>
                                            {kpis.slice(0, 4).map((kpi) => (
                                                <Col
                                                    key={kpi.id}
                                                    xs={24}
                                                    sm={12}
                                                    md={6}
                                                >
                                                    <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                            {kpi.name}
                                                        </div>
                                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                            {kpi.value.toFixed(
                                                                2
                                                            )}
                                                            {kpi.unit ===
                                                            "minutes"
                                                                ? " min"
                                                                : kpi.unit ===
                                                                  "hours"
                                                                ? " hrs"
                                                                : kpi.unit ===
                                                                  "percentage"
                                                                ? "%"
                                                                : ""}
                                                        </div>
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
                                                            className="mt-2"
                                                        />
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </Grid>
                                </Panel>
                            )}
                        </>
                    )}

                    {/* Detalle de Tickets */}
                    {reportType === "tickets" && (
                        <Panel
                            bordered
                            className="bg-white dark:bg-gray-800"
                            header={
                                <h3 className="text-lg font-semibold">
                                    Detalle de Tickets ({tickets.length})
                                </h3>
                            }
                        >
                            <Table data={tickets} autoHeight bordered hover>
                                <Column width={120} fixed>
                                    <HeaderCell>ID</HeaderCell>
                                    <Cell dataKey="key" />
                                </Column>
                                <Column width={300} flexGrow={1}>
                                    <HeaderCell>Título</HeaderCell>
                                    <Cell dataKey="summary" />
                                </Column>
                                <Column width={120}>
                                    <HeaderCell>Estado</HeaderCell>
                                    <Cell>
                                        {(rowData: Ticket) =>
                                            statusLabels[rowData.status]
                                        }
                                    </Cell>
                                </Column>
                                <Column width={120}>
                                    <HeaderCell>Prioridad</HeaderCell>
                                    <Cell>
                                        {(rowData: Ticket) =>
                                            priorityLabels[rowData.priority]
                                        }
                                    </Cell>
                                </Column>
                                <Column width={150}>
                                    <HeaderCell>Asignado</HeaderCell>
                                    <Cell>
                                        {(rowData: Ticket) =>
                                            rowData.assignee?.name ||
                                            "Sin asignar"
                                        }
                                    </Cell>
                                </Column>
                                <Column width={160}>
                                    <HeaderCell>Fecha Creación</HeaderCell>
                                    <Cell>
                                        {(rowData: Ticket) =>
                                            format(
                                                rowData.createdAt,
                                                "dd/MM/yyyy HH:mm",
                                                { locale: es }
                                            )
                                        }
                                    </Cell>
                                </Column>
                                <Column width={100}>
                                    <HeaderCell>SLA</HeaderCell>
                                    <Cell>
                                        {(rowData: Ticket) =>
                                            rowData.slaBreached ? (
                                                <Badge
                                                    content="Vencido"
                                                    color="red"
                                                />
                                            ) : (
                                                <Badge
                                                    content="OK"
                                                    color="green"
                                                />
                                            )
                                        }
                                    </Cell>
                                </Column>
                            </Table>
                        </Panel>
                    )}

                    {/* Reporte de KPIs */}
                    {reportType === "kpis" && (
                        <Panel
                            bordered
                            className="bg-white dark:bg-gray-800"
                            header={
                                <h3 className="text-lg font-semibold">
                                    Reporte de KPIs ({kpis.length})
                                </h3>
                            }
                        >
                            <div className="space-y-4">
                                {kpis.map((kpi) => (
                                    <div
                                        key={kpi.id}
                                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                    {kpi.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    {kpi.description}
                                                </p>
                                            </div>
                                            <Badge
                                                content={
                                                    kpi.status === "excellent"
                                                        ? "Excelente"
                                                        : kpi.status === "good"
                                                        ? "Bueno"
                                                        : kpi.status ===
                                                          "warning"
                                                        ? "Advertencia"
                                                        : "Crítico"
                                                }
                                                color={
                                                    kpi.status === "excellent"
                                                        ? "green"
                                                        : kpi.status === "good"
                                                        ? "blue"
                                                        : kpi.status ===
                                                          "warning"
                                                        ? "yellow"
                                                        : "red"
                                                }
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                                            <div>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    Valor:
                                                </span>
                                                <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                                                    {kpi.value.toFixed(2)}{" "}
                                                    {kpi.unit === "minutes"
                                                        ? "min"
                                                        : kpi.unit === "hours"
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
                                                        Datos:
                                                    </span>
                                                    <span className="ml-2 font-semibold text-gray-900 dark:text-gray-100">
                                                        {kpi.dataPoints}
                                                    </span>
                                                </div>
                                            )}
                                            {kpi.trend && (
                                                <div>
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        Tendencia:
                                                    </span>
                                                    <span
                                                        className={`ml-2 font-semibold ${
                                                            kpi.trend
                                                                .direction ===
                                                            "up"
                                                                ? "text-red-600"
                                                                : kpi.trend
                                                                      .direction ===
                                                                  "down"
                                                                ? "text-green-600"
                                                                : "text-gray-600"
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
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>
                    )}

                    {/* Otros tipos de reporte pueden implementarse aquí */}
                    {(reportType === "by_status" ||
                        reportType === "by_priority" ||
                        reportType === "by_assignee") && (
                        <Panel bordered className="bg-white dark:bg-gray-800">
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                <PieChartIcon
                                    style={{
                                        fontSize: "3em",
                                        marginBottom: "1rem",
                                    }}
                                />
                                <p>
                                    Reporte "
                                    {
                                        reportTypeOptions.find(
                                            (r) => r.value === reportType
                                        )?.label
                                    }
                                    " en desarrollo
                                </p>
                                <p className="text-sm mt-2">
                                    Próximamente con gráficos y análisis
                                    detallados
                                </p>
                            </div>
                        </Panel>
                    )}
                </>
            )}
        </div>
    );
};
