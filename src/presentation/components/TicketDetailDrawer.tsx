import React, { useEffect, useState, useCallback } from "react";
import { Ticket } from "@core/entities/Ticket";
import {
    Drawer,
    Badge,
    Panel,
    Tag,
    Divider,
    Button,
    ButtonToolbar,
    Nav,
    Loader,
    Timeline,
    Avatar,
} from "rsuite";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ExportIcon from "@rsuite/icons/Export";
import { JiraClient } from "@infrastructure/http/JiraClient";
import { JiraCommentsResponse } from "@adapters/jira/types";
import { JiraMapper } from "@adapters/jira/JiraMapper";

interface TicketDetailDrawerProps {
    ticket: Ticket | null;
    open: boolean;
    onClose: () => void;
}

interface Comment {
    id: string;
    author: {
        name: string;
        avatarUrl?: string;
    };
    body: string;
    created: Date;
    updated: Date;
}

/**
 * Drawer lateral para mostrar el detalle completo de un ticket
 */
export const TicketDetailDrawer: React.FC<TicketDetailDrawerProps> = ({
    ticket,
    open,
    onClose,
}) => {
    const [activeTab, setActiveTab] = useState<string>("info");
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);

    const loadComments = useCallback(async () => {
        if (!ticket) return;

        setLoadingComments(true);
        try {
            const jiraClient = new JiraClient();
            const response =
                await jiraClient.getIssueComments<JiraCommentsResponse>(
                    ticket.key
                );

            const mappedComments: Comment[] = response.comments.map(
                (comment) => ({
                    id: comment.id,
                    author: {
                        name: comment.author.displayName,
                        avatarUrl: comment.author.avatarUrls?.["48x48"],
                    },
                    body: JiraMapper.parseDescription(comment.body),
                    created: new Date(comment.created),
                    updated: new Date(comment.updated),
                })
            );

            setComments(mappedComments);
        } catch (error) {
            console.error("Error loading comments:", error);
        } finally {
            setLoadingComments(false);
        }
    }, [ticket]);

    // Cargar comentarios cuando se abre el drawer y se cambia a la pestaña de actividad
    useEffect(() => {
        if (open && ticket && activeTab === "activity") {
            loadComments();
        }
    }, [open, ticket, activeTab, loadComments]);

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

    // Calcular el tiempo que lleva abierto el ticket
    const getOpenTime = () => {
        if (!ticket.createdAt) return { text: "-", minutes: 0 };

        const now = new Date();
        const created = new Date(ticket.createdAt);
        const diffMs = now.getTime() - created.getTime();
        const totalMinutes = Math.floor(diffMs / (1000 * 60));

        const days = Math.floor(totalMinutes / (60 * 24));
        const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
        const mins = totalMinutes % 60;

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (mins > 0 || parts.length === 0) parts.push(`${mins}m`);

        return { text: parts.join(" "), minutes: totalMinutes };
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
            <Drawer.Body>
                <Nav
                    appearance="tabs"
                    activeKey={activeTab}
                    onSelect={setActiveTab}
                    className="mb-4"
                >
                    <Nav.Item eventKey="info">Información</Nav.Item>
                    <Nav.Item eventKey="activity">
                        Actividad
                        {comments.length > 0 && (
                            <Badge content={comments.length} className="ml-2" />
                        )}
                    </Nav.Item>
                </Nav>

                {activeTab === "info" && (
                    <div className="space-y-4">
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
                            header={
                                <h3 className="font-semibold">Información</h3>
                            }
                            bordered
                        >
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Prioridad:
                                    </span>
                                    <Badge
                                        content={
                                            priorityLabels[ticket.priority]
                                        }
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
                                header={
                                    <h3 className="font-semibold">
                                        Descripción
                                    </h3>
                                }
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
                                        {formatMinutes(
                                            ticket.firstResponseTime
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {ticket.status === "resolved" ||
                                        ticket.status === "closed"
                                            ? "Tiempo de Resolución:"
                                            : "Tiempo Abierto:"}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {ticket.status === "resolved" ||
                                            ticket.status === "closed"
                                                ? formatMinutes(
                                                      ticket.resolutionTime
                                                  )
                                                : getOpenTime().text}
                                        </span>
                                        {ticket.status !== "resolved" &&
                                            ticket.status !== "closed" && (
                                                <span className="text-orange-500 dark:text-orange-400 text-xs flex items-center gap-1">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    En aumento
                                                </span>
                                            )}
                                    </div>
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
                                            <Badge
                                                content="Vencido"
                                                color="red"
                                            />
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
                                                <Badge
                                                    content="Sí"
                                                    color="red"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    ({ticket.escalationCount}{" "}
                                                    {ticket.escalationCount ===
                                                    1
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
                                            ticket.resolvedOnFirstContact
                                                ? "Sí"
                                                : "No"
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
                                header={
                                    <h3 className="font-semibold">Etiquetas</h3>
                                }
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
                                header={
                                    <h3 className="font-semibold">Sprint</h3>
                                }
                                bordered
                            >
                                <p className="text-gray-900 dark:text-gray-100">
                                    {ticket.sprint}
                                </p>
                            </Panel>
                        )}
                    </div>
                )}

                {activeTab === "activity" && (
                    <div className="space-y-4">
                        {loadingComments ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader
                                    size="md"
                                    content="Cargando comentarios..."
                                />
                            </div>
                        ) : comments.length === 0 ? (
                            <Panel bordered>
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No hay comentarios en este ticket
                                </div>
                            </Panel>
                        ) : (
                            <Panel
                                header={
                                    <h3 className="font-semibold">
                                        Comentarios ({comments.length})
                                    </h3>
                                }
                                bordered
                            >
                                <Timeline className="custom-timeline">
                                    {comments.map((comment) => (
                                        <Timeline.Item key={comment.id}>
                                            <div className="flex gap-3">
                                                <Avatar
                                                    circle
                                                    src={
                                                        comment.author.avatarUrl
                                                    }
                                                    alt={comment.author.name}
                                                    size="sm"
                                                >
                                                    {!comment.author
                                                        .avatarUrl &&
                                                        comment.author.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                            {
                                                                comment.author
                                                                    .name
                                                            }
                                                        </span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {format(
                                                                comment.created,
                                                                "dd/MM/yyyy HH:mm",
                                                                { locale: es }
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                        {comment.body}
                                                    </div>
                                                    {comment.created.getTime() !==
                                                        comment.updated.getTime() && (
                                                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                            Editado:{" "}
                                                            {format(
                                                                comment.updated,
                                                                "dd/MM/yyyy HH:mm",
                                                                { locale: es }
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            </Panel>
                        )}
                    </div>
                )}
            </Drawer.Body>
        </Drawer>
    );
};
