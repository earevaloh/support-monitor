import { Ticket } from "../entities/Ticket";
import { KPI, KPIEntity } from "../entities/KPI";

/**
 * Caso de uso para calcular KPIs a partir de tickets
 */
export class CalculateKPIsUseCase {
    /**
     * Ejecuta el cálculo de todos los KPIs
     */
    execute(tickets: Ticket[]): KPI[] {
        return [
            this.calculateFRT(tickets),
            this.calculateTTR(tickets),
            this.calculateSLACompliance(tickets),
            this.calculateSLAAverage(tickets),
            this.calculateFCR(tickets),
            this.calculateFRRT(tickets),
            this.calculateEscalations(tickets),
        ];
    }

    /**
     * Calcula First Response Time (FRT)
     * Tiempo promedio de primera respuesta < 2h
     */
    private calculateFRT(tickets: Ticket[]): KPI {
        const ticketsWithFRT = tickets.filter(
            (t) => t.firstResponseTime !== undefined
        );
        const totalFRT = ticketsWithFRT.reduce(
            (sum, t) => sum + (t.firstResponseTime || 0),
            0
        );
        const averageFRT =
            ticketsWithFRT.length > 0 ? totalFRT / ticketsWithFRT.length : 0;
        const frtInHours = averageFRT / 60;

        return new KPIEntity({
            category: "FRT",
            name: "First Response Time",
            value: parseFloat(frtInHours.toFixed(2)),
            unit: "hours",
            status: this.getFRTStatus(frtInHours),
            thresholds: {
                excellent: 2,
                good: 3,
                warning: 4,
                critical: 48,
            },
            description: "Tiempo promedio de primera respuesta a tickets",
            dataPoints: ticketsWithFRT.length,
        });
    }

    /**
     * Calcula Time to Resolve (TTR)
     * Tiempo promedio de resolución < 24h
     */
    private calculateTTR(tickets: Ticket[]): KPI {
        const resolvedTickets = tickets.filter(
            (t) => t.resolutionTime !== undefined
        );
        const totalTTR = resolvedTickets.reduce(
            (sum, t) => sum + (t.resolutionTime || 0),
            0
        );
        const averageTTR =
            resolvedTickets.length > 0 ? totalTTR / resolvedTickets.length : 0;
        const ttrInHours = averageTTR / 60;

        return new KPIEntity({
            category: "TTR",
            name: "Time to Resolve",
            value: parseFloat(ttrInHours.toFixed(2)),
            unit: "hours",
            status: this.getTTRStatus(ttrInHours),
            thresholds: {
                excellent: 24,
                good: 36,
                warning: 48,
                critical: 72,
            },
            description: "Tiempo promedio de resolución de tickets",
            dataPoints: resolvedTickets.length,
        });
    }

    /**
     * Calcula SLA Compliance
     * Porcentaje de tickets que cumplen SLA ≥ 90%
     */
    private calculateSLACompliance(tickets: Ticket[]): KPI {
        const compliantTickets = tickets.filter((t) => !t.slaBreached);
        const compliancePercentage =
            tickets.length > 0
                ? (compliantTickets.length / tickets.length) * 100
                : 0;

        return new KPIEntity({
            category: "SLA_COMPLIANCE",
            name: "SLA Compliance",
            value: parseFloat(compliancePercentage.toFixed(2)),
            unit: "percentage",
            status: this.getSLAComplianceStatus(compliancePercentage),
            thresholds: {
                excellent: 95,
                good: 90,
                warning: 80,
                critical: 70,
            },
            description: "Porcentaje de tickets que cumplen con el SLA",
            dataPoints: tickets.length,
        });
    }

    /**
     * Calcula SLA Average
     * Promedio de calificación de SLA ≥ 4 estrellas
     */
    private calculateSLAAverage(tickets: Ticket[]): KPI {
        const totalSLA = tickets.reduce((sum, t) => sum + t.slaCompliance, 0);
        const averageSLA = tickets.length > 0 ? totalSLA / tickets.length : 0;

        return new KPIEntity({
            category: "SLA_AVERAGE",
            name: "SLA Average",
            value: parseFloat(averageSLA.toFixed(2)),
            unit: "stars",
            status: this.getSLAAverageStatus(averageSLA),
            thresholds: {
                excellent: 4.5,
                good: 4,
                warning: 3.5,
                critical: 3,
            },
            description: "Calificación promedio de cumplimiento de SLA",
            dataPoints: tickets.length,
        });
    }

    /**
     * Calcula First Contact Resolution (FCR)
     * Porcentaje de tickets resueltos en primer contacto ≥ 60%
     */
    private calculateFCR(tickets: Ticket[]): KPI {
        const resolvedTickets = tickets.filter(
            (t) => t.status === "resolved" || t.status === "closed"
        );
        const fcrTickets = resolvedTickets.filter(
            (t) => t.resolvedOnFirstContact
        );
        const fcrPercentage =
            resolvedTickets.length > 0
                ? (fcrTickets.length / resolvedTickets.length) * 100
                : 0;

        return new KPIEntity({
            category: "FCR",
            name: "First Contact Resolution",
            value: parseFloat(fcrPercentage.toFixed(2)),
            unit: "percentage",
            status: this.getFCRStatus(fcrPercentage),
            thresholds: {
                excellent: 70,
                good: 60,
                warning: 50,
                critical: 45,
            },
            description:
                "Porcentaje de tickets resueltos en el primer contacto",
            dataPoints: resolvedTickets.length,
        });
    }

    /**
     * Calcula Fast Reply Rate (FRRT)
     * Porcentaje de respuestas rápidas < 10%
     */
    private calculateFRRT(tickets: Ticket[]): KPI {
        const ticketsWithFRT = tickets.filter(
            (t) => t.firstResponseTime !== undefined
        );
        const fastReplies = ticketsWithFRT.filter(
            (t) => (t.firstResponseTime || 0) <= 30
        ); // 30 minutos
        const frrtPercentage =
            ticketsWithFRT.length > 0
                ? (fastReplies.length / ticketsWithFRT.length) * 100
                : 0;

        return new KPIEntity({
            category: "FRRT",
            name: "Fast Reply Rate",
            value: parseFloat(frrtPercentage.toFixed(2)),
            unit: "percentage",
            status: this.getFRRTStatus(frrtPercentage),
            thresholds: {
                excellent: 80,
                good: 70,
                warning: 60,
                critical: 50,
            },
            description: "Porcentaje de respuestas rápidas (< 30 min)",
            dataPoints: ticketsWithFRT.length,
        });
    }

    /**
     * Calcula el porcentaje de escalaciones
     * Porcentaje de tickets escalados < 15%
     */
    private calculateEscalations(tickets: Ticket[]): KPI {
        const escalatedTickets = tickets.filter((t) => t.escalated);
        const escalationPercentage =
            tickets.length > 0
                ? (escalatedTickets.length / tickets.length) * 100
                : 0;

        return new KPIEntity({
            category: "ESCALATIONS",
            name: "Escalations",
            value: parseFloat(escalationPercentage.toFixed(2)),
            unit: "percentage",
            status: this.getEscalationsStatus(escalationPercentage),
            thresholds: {
                excellent: 10,
                good: 15,
                warning: 20,
                critical: 25,
            },
            description: "Porcentaje de tickets escalados",
            dataPoints: tickets.length,
        });
    }

    // Métodos de ayuda para determinar el status basado en umbrales
    private getFRTStatus(
        hours: number
    ): "excellent" | "good" | "warning" | "critical" {
        if (hours <= 2) return "excellent";
        if (hours <= 3) return "good";
        if (hours <= 4) return "warning";
        return "critical";
    }

    private getTTRStatus(
        hours: number
    ): "excellent" | "good" | "warning" | "critical" {
        if (hours <= 24) return "excellent";
        if (hours <= 36) return "good";
        if (hours <= 48) return "warning";
        return "critical";
    }

    private getSLAComplianceStatus(
        percentage: number
    ): "excellent" | "good" | "warning" | "critical" {
        if (percentage >= 95) return "excellent";
        if (percentage >= 90) return "good";
        if (percentage >= 80) return "warning";
        return "critical";
    }

    private getSLAAverageStatus(
        stars: number
    ): "excellent" | "good" | "warning" | "critical" {
        if (stars >= 4.5) return "excellent";
        if (stars >= 4) return "good";
        if (stars >= 3.5) return "warning";
        return "critical";
    }

    private getFCRStatus(
        percentage: number
    ): "excellent" | "good" | "warning" | "critical" {
        if (percentage >= 70) return "excellent";
        if (percentage >= 60) return "good";
        if (percentage >= 50) return "warning";
        return "critical";
    }

    private getFRRTStatus(
        percentage: number
    ): "excellent" | "good" | "warning" | "critical" {
        if (percentage >= 80) return "excellent";
        if (percentage >= 70) return "good";
        if (percentage >= 60) return "warning";
        return "critical";
    }

    private getEscalationsStatus(
        percentage: number
    ): "excellent" | "good" | "warning" | "critical" {
        if (percentage <= 10) return "excellent";
        if (percentage <= 15) return "good";
        if (percentage <= 20) return "warning";
        return "critical";
    }
}
