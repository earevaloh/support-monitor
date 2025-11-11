/**
 * Entidad de Sprint del dominio
 * Representa un sprint o periodo de tiempo para análisis
 */
export interface Sprint {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isClosed: boolean;
    goal?: string;
}

/**
 * Clase para crear instancias de Sprint
 */
export class SprintEntity implements Sprint {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isClosed: boolean;
    goal?: string;

    constructor(
        data: Omit<Sprint, "isActive" | "isClosed"> &
            Partial<Pick<Sprint, "isActive" | "isClosed">>
    ) {
        this.id = data.id;
        this.name = data.name;
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.goal = data.goal;

        // Calcular si está activo o cerrado
        const now = new Date();
        this.isActive =
            data.isActive ?? (now >= this.startDate && now <= this.endDate);
        this.isClosed = data.isClosed ?? now > this.endDate;
    }

    /**
     * Verifica si el sprint está en progreso
     */
    isInProgress(): boolean {
        return this.isActive && !this.isClosed;
    }

    /**
     * Obtiene la duración del sprint en días
     */
    getDurationInDays(): number {
        const diff = this.endDate.getTime() - this.startDate.getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }
}
