import React from "react";
import { KPI } from "@core/entities/KPI";

/**
 * Props del componente KPICard
 */
interface KPICardProps {
    kpi: KPI;
    showTrend?: boolean;
}

/**
 * Componente para mostrar una tarjeta de KPI
 */
export const KPICard: React.FC<KPICardProps> = ({ kpi, showTrend = false }) => {
    const getStatusColor = (status: string): string => {
        const colors = {
            excellent: "bg-success-light border-success-dark",
            good: "bg-primary-100 border-primary-600",
            warning: "bg-warning-light border-warning-dark",
            critical: "bg-critical-light border-critical-dark",
        };
        return (
            colors[status as keyof typeof colors] ||
            "bg-gray-100 border-gray-400"
        );
    };

    const formatValue = (): string => {
        switch (kpi.unit) {
            case "hours":
                return `${kpi.value}h`;
            case "minutes":
                return `${kpi.value}min`;
            case "percentage":
                return `${kpi.value}%`;
            case "stars":
                return `${kpi.value} ⭐`;
            default:
                return kpi.value.toString();
        }
    };

    const getTrendIcon = () => {
        if (!kpi.trend) return null;

        const { direction, percentage } = kpi.trend;
        const icon =
            direction === "up" ? "↑" : direction === "down" ? "↓" : "→";
        const color =
            direction === "up"
                ? "text-green-600"
                : direction === "down"
                ? "text-red-600"
                : "text-gray-600";

        return (
            <span className={`text-sm font-medium ${color}`}>
                {icon} {percentage.toFixed(1)}%
            </span>
        );
    };

    return (
        <div
            className={`card card-hover border-l-4 ${getStatusColor(
                kpi.status
            )} transition-all duration-200`}
        >
            <div className="flex flex-col space-y-2">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {kpi.name}
                    </h3>
                    <span className={`badge badge-${kpi.status}`}>
                        {kpi.status.toUpperCase()}
                    </span>
                </div>

                {/* Valor principal */}
                <div className="flex items-baseline space-x-2">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatValue()}
                    </span>
                    {showTrend && kpi.trend && getTrendIcon()}
                </div>

                {/* Descripción */}
                <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.description}</p>

                {/* Metadata */}
                {kpi.dataPoints && (
                    <div className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200 dark:border-gray-700">
                        Basado en {kpi.dataPoints} tickets
                    </div>
                )}
            </div>
        </div>
    );
};
