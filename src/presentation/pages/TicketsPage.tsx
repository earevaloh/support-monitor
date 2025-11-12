import React, { useEffect, useState, useMemo } from "react";
import { useTicketsStore } from "@presentation/store/ticketsStore";
import { Ticket } from "@core/entities/Ticket";
import { TicketDetailDrawer } from "@presentation/components/TicketDetailDrawer";
import {
    Table,
    Input,
    InputGroup,
    TagPicker,
    Panel,
    Loader,
    Badge,
    Pagination,
} from "rsuite";
import SearchIcon from "@rsuite/icons/Search";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const { Column, HeaderCell, Cell } = Table;

/**
 * Página de Tickets
 * Vista completa de la lista de tickets con filtros y búsqueda
 */
export const TicketsPage: React.FC = () => {
    const { tickets, loading, fetchTickets } = useTicketsStore();

    // Estados para filtros y búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);

    // Estados para el drawer de detalle
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Cargar tickets al montar
    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    // Manejador para abrir el detalle de un ticket
    const handleRowClick = (rowData: Ticket) => {
        setSelectedTicket(rowData);
        setDrawerOpen(true);
    };

    // Manejador para cerrar el drawer
    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    // Opciones para los filtros
    const statusOptions = [
        { label: "Abierto", value: "open" },
        { label: "En Progreso", value: "in_progress" },
        { label: "Pendiente", value: "pending" },
        { label: "Resuelto", value: "resolved" },
        { label: "Cerrado", value: "closed" },
    ];

    const priorityOptions = [
        { label: "Más Bajo", value: "lowest" },
        { label: "Bajo", value: "low" },
        { label: "Medio", value: "medium" },
        { label: "Alto", value: "high" },
        { label: "Más Alto", value: "highest" },
    ];

    // Filtrar y paginar tickets
    const filteredTickets = useMemo(() => {
        let filtered = tickets;

        // Filtro de búsqueda
        if (searchTerm) {
            filtered = filtered.filter(
                (ticket) =>
                    ticket.key
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    ticket.summary
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    ticket.assignee?.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Filtro de estado
        if (statusFilter.length > 0) {
            filtered = filtered.filter((ticket) =>
                statusFilter.includes(ticket.status)
            );
        }

        // Filtro de prioridad
        if (priorityFilter.length > 0) {
            filtered = filtered.filter((ticket) =>
                priorityFilter.includes(ticket.priority)
            );
        }

        return filtered;
    }, [tickets, searchTerm, statusFilter, priorityFilter]);

    // Tickets paginados
    const paginatedTickets = useMemo(() => {
        const start = (page - 1) * limit;
        const end = start + limit;
        return filteredTickets.slice(start, end);
    }, [filteredTickets, page, limit]);

    // Funciones para renderizar celdas
    const StatusCell = ({ rowData, ...props }: any) => {
        const statusColors: Record<
            string,
            "blue" | "orange" | "yellow" | "green" | "cyan" | "red" | "violet"
        > = {
            open: "blue",
            in_progress: "orange",
            pending: "yellow",
            resolved: "green",
            closed: "cyan",
        };

        const statusLabels: Record<string, string> = {
            open: "Abierto",
            in_progress: "En Progreso",
            pending: "Pendiente",
            resolved: "Resuelto",
            closed: "Cerrado",
        };

        return (
            <Cell {...props}>
                <Badge
                    content={statusLabels[rowData.status] || rowData.status}
                    color={statusColors[rowData.status] || "blue"}
                />
            </Cell>
        );
    };

    const PriorityCell = ({ rowData, ...props }: any) => {
        const priorityColors: Record<
            string,
            "blue" | "orange" | "yellow" | "green" | "cyan" | "red" | "violet"
        > = {
            lowest: "cyan",
            low: "blue",
            medium: "yellow",
            high: "orange",
            highest: "red",
        };

        const priorityLabels: Record<string, string> = {
            lowest: "Más Bajo",
            low: "Bajo",
            medium: "Medio",
            high: "Alto",
            highest: "Más Alto",
        };

        return (
            <Cell {...props}>
                <Badge
                    content={
                        priorityLabels[rowData.priority] || rowData.priority
                    }
                    color={priorityColors[rowData.priority] || "blue"}
                />
            </Cell>
        );
    };

    const DateCell = ({ rowData, dataKey, ...props }: any) => {
        const date = rowData[dataKey] as Date;
        return (
            <Cell {...props}>
                {date ? format(date, "dd/MM/yyyy HH:mm", { locale: es }) : "-"}
            </Cell>
        );
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter([]);
        setPriorityFilter([]);
        setPage(1);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" content="Cargando tickets..." />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Tickets
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {filteredTickets.length} de {tickets.length} tickets
                    </p>
                </div>
            </div>

            {/* Filtros */}
            <Panel
                bordered
                className="bg-white dark:bg-gray-800"
                header={<h3 className="text-lg font-semibold">Filtros</h3>}
                collapsible
                defaultExpanded
            >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Búsqueda */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Buscar
                        </label>
                        <InputGroup>
                            <Input
                                placeholder="ID, título o asignado..."
                                value={searchTerm}
                                onChange={setSearchTerm}
                            />
                            <InputGroup.Addon>
                                <SearchIcon />
                            </InputGroup.Addon>
                        </InputGroup>
                    </div>

                    {/* Filtro de Estado */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Estado
                        </label>
                        <TagPicker
                            data={statusOptions}
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value || [])}
                            placeholder="Todos los estados"
                            block
                            cleanable
                        />
                    </div>

                    {/* Filtro de Prioridad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Prioridad
                        </label>
                        <TagPicker
                            data={priorityOptions}
                            value={priorityFilter}
                            onChange={(value) => setPriorityFilter(value || [])}
                            placeholder="Todas las prioridades"
                            block
                            cleanable
                        />
                    </div>

                    {/* Botón limpiar */}
                    <div className="flex items-end">
                        <button
                            onClick={handleClearFilters}
                            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Limpiar Filtros
                        </button>
                    </div>
                </div>
            </Panel>

            {/* Tabla de Tickets */}
            <Panel bordered className="bg-white dark:bg-gray-800">
                <Table
                    data={paginatedTickets}
                    autoHeight
                    hover
                    rowHeight={60}
                    headerHeight={50}
                    onRowClick={handleRowClick}
                    className="cursor-pointer"
                >
                    <Column width={120} fixed>
                        <HeaderCell>ID</HeaderCell>
                        <Cell dataKey="key" />
                    </Column>

                    <Column width={300} flexGrow={1}>
                        <HeaderCell>Título</HeaderCell>
                        <Cell dataKey="summary" />
                    </Column>

                    <Column width={140}>
                        <HeaderCell>Estado</HeaderCell>
                        <StatusCell dataKey="status" />
                    </Column>

                    <Column width={140}>
                        <HeaderCell>Prioridad</HeaderCell>
                        <PriorityCell dataKey="priority" />
                    </Column>

                    <Column width={150}>
                        <HeaderCell>Asignado</HeaderCell>
                        <Cell>
                            {(rowData: Ticket) =>
                                rowData.assignee?.name || "Sin asignar"
                            }
                        </Cell>
                    </Column>

                    <Column width={160}>
                        <HeaderCell>Fecha Creación</HeaderCell>
                        <DateCell dataKey="createdAt" />
                    </Column>

                    <Column width={100}>
                        <HeaderCell>SLA</HeaderCell>
                        <Cell>
                            {(rowData: Ticket) =>
                                rowData.slaBreached ? (
                                    <Badge content="Vencido" color="red" />
                                ) : (
                                    <Badge content="OK" color="green" />
                                )
                            }
                        </Cell>
                    </Column>
                </Table>

                {/* Paginación */}
                {filteredTickets.length > 0 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination
                            prev
                            next
                            first
                            last
                            ellipsis
                            boundaryLinks
                            maxButtons={5}
                            size="md"
                            layout={[
                                "total",
                                "-",
                                "limit",
                                "|",
                                "pager",
                                "skip",
                            ]}
                            total={filteredTickets.length}
                            limitOptions={[10, 20, 50, 100]}
                            limit={limit}
                            activePage={page}
                            onChangePage={setPage}
                            onChangeLimit={(newLimit) => {
                                setLimit(newLimit);
                                setPage(1);
                            }}
                        />
                    </div>
                )}
            </Panel>

            {/* Drawer de detalle del ticket */}
            <TicketDetailDrawer
                ticket={selectedTicket}
                open={drawerOpen}
                onClose={handleDrawerClose}
            />
        </div>
    );
};
