/**
 * Utilidades para formateo de números y porcentajes
 */

/**
 * Formatea un número a porcentaje con decimales
 */
export const formatPercentage = (
    value: number,
    decimals: number = 1
): string => {
    return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("es-ES").format(value);
};

/**
 * Calcula el porcentaje de un valor respecto al total
 */
export const calculatePercentage = (value: number, total: number): number => {
    if (total === 0) return 0;
    return (value / total) * 100;
};

/**
 * Redondea un número a N decimales
 */
export const roundTo = (value: number, decimals: number = 2): number => {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
