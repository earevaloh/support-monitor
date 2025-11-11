import { KPIStatus, KPICategory } from "../types";

/**
 * Entidad de KPI del dominio
 * Representa un indicador clave de rendimiento calculado
 */
export interface KPI {
    id: string;
    category: KPICategory;
    name: string;
    value: number;
    unit: string; // 'hours', 'minutes', 'percentage', 'count'
    status: KPIStatus;

    // Umbrales
    thresholds: {
        excellent: number;
        good: number;
        warning: number;
        critical: number;
    };

    // Tendencia
    trend?: {
        direction: "up" | "down" | "stable";
        percentage: number;
    };

    // Metadata
    description: string;
    lastCalculated: Date;
    dataPoints?: number; // Cantidad de datos usados para el cálculo
}

/**
 * Clase para crear instancias de KPI
 */
export class KPIEntity implements KPI {
    id: string;
    category: KPICategory;
    name: string;
    value: number;
    unit: string;
    status: KPIStatus;
    thresholds: {
        excellent: number;
        good: number;
        warning: number;
        critical: number;
    };
    trend?: {
        direction: "up" | "down" | "stable";
        percentage: number;
    };
    description: string;
    lastCalculated: Date;
    dataPoints?: number;

    constructor(data: Omit<KPI, "id" | "lastCalculated"> & { id?: string }) {
        this.id = data.id || `kpi-${data.category}-${Date.now()}`;
        this.category = data.category;
        this.name = data.name;
        this.value = data.value;
        this.unit = data.unit;
        this.status = data.status;
        this.thresholds = data.thresholds;
        this.trend = data.trend;
        this.description = data.description;
        this.lastCalculated = new Date();
        this.dataPoints = data.dataPoints;
    }

    /**
     * Calcula el status basado en el valor y los umbrales
     */
    calculateStatus(): KPIStatus {
        const { value, thresholds } = this;

        if (value <= thresholds.excellent) return "excellent";
        if (value <= thresholds.good) return "good";
        if (value <= thresholds.warning) return "warning";
        return "critical";
    }
}
