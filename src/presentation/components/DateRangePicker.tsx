import React from "react";
import { DateRangePicker as RSuiteDateRangePicker } from "rsuite";
import { DateRange } from "rsuite/esm/DateRangePicker";
import {
    startOfWeek,
    endOfDay,
    startOfMonth,
    endOfMonth,
    subMonths,
    subWeeks,
    startOfDay,
} from "date-fns";

interface DateRangePickerProps {
    value: DateRange | null;
    onChange: (value: DateRange | null) => void;
}

/**
 * Componente de selector de rango de fechas con atajos predefinidos
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
    value,
    onChange,
}) => {
    const today = new Date();

    // Definir los rangos predefinidos
    const predefinedRanges = [
        {
            label: "Esta Semana",
            value: [
                startOfWeek(today, { weekStartsOn: 1 }), // Lunes
                endOfDay(today),
            ] as DateRange,
            placement: "left" as const,
        },
        {
            label: "Última Semana",
            value: [
                startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 }), // Lunes pasado
                endOfDay(
                    new Date(
                        startOfWeek(today, { weekStartsOn: 1 }).getTime() - 1
                    )
                ), // Domingo pasado
            ] as DateRange,
            placement: "left" as const,
        },
        {
            label: "Este Mes",
            value: [startOfMonth(today), endOfDay(today)] as DateRange,
            placement: "left" as const,
        },
        {
            label: "Mes Pasado",
            value: [
                startOfMonth(subMonths(today, 1)),
                endOfMonth(subMonths(today, 1)),
            ] as DateRange,
            placement: "left" as const,
        },
        {
            label: "Todo",
            value: [
                startOfDay(new Date(2025, 0, 1)), // 1 de enero 2025
                endOfDay(today),
            ] as DateRange,
            placement: "left" as const,
        },
    ];

    return (
        <RSuiteDateRangePicker
            value={value}
            onChange={onChange}
            ranges={predefinedRanges}
            placeholder="Seleccionar rango de fechas"
            format="dd/MM/yyyy"
            locale={{
                sunday: "Do",
                monday: "Lu",
                tuesday: "Ma",
                wednesday: "Mi",
                thursday: "Ju",
                friday: "Vi",
                saturday: "Sa",
                ok: "Aceptar",
                today: "Hoy",
                yesterday: "Ayer",
                last7Days: "Últimos 7 días",
                hours: "Horas",
                minutes: "Minutos",
                seconds: "Segundos",
            }}
            className="w-full"
            cleanable={false}
            showOneCalendar={false}
        />
    );
};
