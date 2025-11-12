import React from "react";
import { Ticket } from "@core/entities/Ticket";
import {
    Drawer,
    Badge,
    Panel,
    Tag,
    Divider,
    Button,
    ButtonToolbar,
} from "rsuite";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ExportIcon from "@rsuite/icons/Export";

interface TicketDetailDrawerProps {
    ticket: Ticket | null;
    open: boolean;
    onClose: () => void;
}

/**
 * Drawer lateral para mostrar el detalle completo de un ticket
 */
export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({
    ticket,
    open,
    onClose,
}) => {
    if (!ticket) return null;

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

    const formatDate = (date: Date | undefined) => {
        return date ? format(date, "dd/MM/yyyy HH:mm", { locale: es }) : "-";
    };

    const formatMinutes = (minutes: number | undefined) => {
        if (!minutes) return "-";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}m`;
        }
        return `${mins}m`;
    };

    // Función para obtener la URL del ticket en Jira
    const getJiraUrl = () => {
        const jiraBaseUrl =
            import.meta.env.VITE_JIRA_BASE_URL ||
            "https://webtrackdev.atlassian.net";
        return `${jiraBaseUrl}/browse/${ticket.key}`;
    };

    // Función para abrir el ticket en Jira
    const handleOpenInJira = () => {
        window.open(getJiraUrl(), "_blank", "noopener,noreferrer");
    };

    return (
        <Drawer open={open} onClose={onClose} size="md" placement="right">
            <Drawer.Header>
                <Drawer.Title>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-lg">
                                {ticket.key}
                            </span>
                            <Badge
                                content={statusLabels[ticket.status]}
                                color={statusColors[ticket.status]}
                            />
                        </div>
                        <ButtonToolbar>
                            <Button
                                appearance="primary"
                                size="sm"
                                onClick={handleOpenInJira}
                                startIcon={<ExportIcon />}
                            >
                                Abrir en Jira
                            </Button>
                        </ButtonToolbar>
                    </div>
                </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="space-y-4">
                {/* Resumen */}
                <Panel
                    header={<h3 className="font-semibold">Resumen</h3>}
                    bordered
                >
                    <p className="text-gray-900 dark:text-gray-100 text-lg">
                        {ticket.summary}
                    </p>
                </Panel>

                {/* Información Principal */}
                <Panel
                    header={<h3 className="font-semibold">Información</h3>}
                    bordered
                >
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                                Prioridad:
                            </span>
                            <Badge
                                content={priorityLabels[ticket.priority]}
                                color={priorityColors[ticket.priority]}
                            />
                        </div>

                        <Divider className="my-2" />

                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                                Asignado:
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {ticket.assignee?.name || "Sin asignar"}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                                Reportado por:
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {ticket.reporter.name}
                            </span>
                        </div>

                        <Divider className="my-2" />

                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                                Creado:
                            </span>
                            <span className="text-gray-900 dark:text-gray-100">
                                {formatDate(ticket.createdAt)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                                Actualizado:
                            </span>
                            <span className="text-gray-900 dark:text-gray-100">
                                {formatDate(ticket.updatedAt)}
                            </span>
                        </div>

                        {ticket.resolvedAt && (
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">
                                    Resuelto:
                                </span>
                                <span className="text-gray-900 dark:text-gray-100">
                                    {formatDate(ticket.resolvedAt)}
                                </span>
                            </div>
                        )}
                    </div>
                </Panel>

                {/* Descripción */}
                {ticket.description && (
                    <Panel
                        header={<h3 className="font-semibold">Descripción</h3>}
                        bordered
                    >
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                            {ticket.description}
                        </p>
                    </Panel>
                )}

                {/* Métricas de Tiempo */}
                <Panel
                    header={<h3 className="font-semibold">Métricas</h3>}
                    bordered
                >
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                                Tiempo Primera Respuesta:
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formatMinutes(ticket.firstResponseTime)}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">
                                Tiempo de Resolución:
                            </span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                {formatMinutes(ticket.resolutionTime)}
                            </span>
                        </div>

                        <Divider className="my-2" />

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                                SLA:
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-900 dark:text-gray-100">
                                    {"⭐".repeat(ticket.slaCompliance)}
                                </span>
                                {ticket.slaBreached ? (
                                    <Badge content="Vencido" color="red" />
                                ) : (
                                    <Badge content="OK" color="green" />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                                Escalado:
                            </span>
                            <div className="flex items-center gap-2">
                                {ticket.escalated ? (
                                    <>
                                        <Badge content="Sí" color="red" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            ({ticket.escalationCount}{" "}
                                            {ticket.escalationCount === 1
                                                ? "vez"
                                                : "veces"}
                                            )
                                        </span>
                                    </>
                                ) : (
                                    <Badge content="No" color="green" />
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">
                                First Contact Resolution:
                            </span>
                            <Badge
                                content={
                                    ticket.resolvedOnFirstContact ? "Sí" : "No"
                                }
                                color={
                                    ticket.resolvedOnFirstContact
                                        ? "green"
                                        : "orange"
                                }
                            />
                        </div>
                    </div>
                </Panel>

                {/* Labels */}
                {ticket.labels.length > 0 && (
                    <Panel
                        header={<h3 className="font-semibold">Etiquetas</h3>}
                        bordered
                    >
                        <div className="flex flex-wrap gap-2">
                            {ticket.labels.map((label, index) => (
                                <Tag key={index} color="blue">
                                    {label}
                                </Tag>
                            ))}
                        </div>
                    </Panel>
                )}

                {/* Sprint */}
                {ticket.sprint && (
                    <Panel
                        header={<h3 className="font-semibold">Sprint</h3>}
                        bordered
                    >
                        <p className="text-gray-900 dark:text-gray-100">
                            {ticket.sprint}
                        </p>
                    </Panel>
                )}
            </Drawer.Body>
        </Drawer>
    );
};
