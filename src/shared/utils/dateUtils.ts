/**
 * Utilidades para formateo de fechas y tiempos
 */

/**
 * Convierte minutos a formato legible (Xh Ymin)
 */
export const formatMinutesToReadable = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);

    if (hours === 0) {
        return `${mins}min`;
    }

    if (mins === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${mins}min`;
};

/**
 * Convierte horas a días si es mayor a 24h
 */
export const formatHoursToDays = (hours: number): string => {
    if (hours < 24) {
        return `${hours.toFixed(1)}h`;
    }

    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);

    if (remainingHours === 0) {
        return `${days}d`;
    }

    return `${days}d ${remainingHours}h`;
};

/**
 * Calcula la diferencia en días entre dos fechas
 */
export const daysDifference = (date1: Date, date2: Date): number => {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
