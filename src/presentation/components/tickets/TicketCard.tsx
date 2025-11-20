import React from "react";
import { Ticket } from "@core/entities/Ticket";
import { Badge, Whisper, Tooltip } from "rsuite";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Props del componente TicketCard
 */
interface TicketCardProps {
    ticket: Ticket;
    onClick?: () => void;
}

/**
 * Componente para mostrar una tarjeta de ticket
 */
export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onClick }) => {
    const getPriorityColor = (
        priority: string
    ): "blue" | "orange" | "yellow" | "green" | "cyan" | "red" | "violet" => {
        const colors: Record<
            string,
            "blue" | "orange" | "yellow" | "green" | "cyan" | "red" | "violet"
        > = {
            lowest: "green",
            low: "cyan",
            medium: "blue",
            high: "orange",
            highest: "red",
        };
        return colors[priority] || "blue";
    };

    const getStatusColor = (
        status: string
    ): "blue" | "orange" | "yellow" | "green" | "cyan" | "red" | "violet" => {
        const colors: Record<
            string,
            "blue" | "orange" | "yellow" | "green" | "cyan" | "red" | "violet"
        > = {
            open: "blue",
            in_progress: "cyan",
            pending: "orange",
            resolved: "green",
            closed: "cyan",
        };
        return colors[status] || "blue";
    };

    return (
        <div className="card card-hover cursor-pointer" onClick={onClick}>
            <div className="flex flex-col space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono font-semibold text-primary-600 dark:text-primary-400">
                            {ticket.key}
                        </span>
                        <Badge
                            color={getPriorityColor(ticket.priority)}
                            content={ticket.priority.toUpperCase()}
                        />
                    </div>
                    <Badge
                        color={getStatusColor(ticket.status)}
                        content={ticket.status.replace("_", " ").toUpperCase()}
                    />
                </div>

                {/* Summary */}
                <h3 className="text-base font-medium text-gray-900 dark:text-white line-clamp-2">
                    {ticket.summary}
                </h3>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {ticket.assignee && (
                        <Whisper
                            placement="top"
                            speaker={
                                <Tooltip>{ticket.assignee.displayName}</Tooltip>
                            }
                        >
                            <div className="flex items-center space-x-1">
                                <span>👤</span>
                                <span>{ticket.assignee.name}</span>
                            </div>
                        </Whisper>
                    )}

                    <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span>
                            {format(new Date(ticket.createdAt), "dd MMM yyyy", {
                                locale: es,
                            })}
                        </span>
                    </div>

                    {ticket.sprint && (
                        <div className="flex items-center space-x-1">
                            <span>🏃</span>
                            <span>{ticket.sprint}</span>
                        </div>
                    )}
                </div>

                {/* Labels */}
                {ticket.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {ticket.labels.slice(0, 3).map((label) => (
                            <span
                                key={label}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                            >
                                {label}
                            </span>
                        ))}
                        {ticket.labels.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                +{ticket.labels.length - 3}
                            </span>
                        )}
                    </div>
                )}

                {/* SLA & Indicators */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            SLA:
                        </span>
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={
                                        i < ticket.slaCompliance
                                            ? "text-yellow-400"
                                            : "text-gray-300 dark:text-gray-600"
                                    }
                                >
                                    ⭐
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        {ticket.escalated && (
                            <Whisper
                                placement="top"
                                speaker={<Tooltip>Ticket escalado</Tooltip>}
                            >
                                <span className="text-red-500">🚨</span>
                            </Whisper>
                        )}
                        {ticket.resolvedOnFirstContact && (
                            <Whisper
                                placement="top"
                                speaker={
                                    <Tooltip>
                                        Resuelto en primer contacto
                                    </Tooltip>
                                }
                            >
                                <span className="text-green-500">✓</span>
                            </Whisper>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
