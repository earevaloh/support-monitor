import { Sprint } from "../entities/Sprint";

/**
 * Interfaz del repositorio de sprints
 * Define el contrato para obtener y gestionar sprints
 */
export interface ISprintRepository {
    /**
     * Obtiene todos los sprints
     */
    getAll(): Promise<Sprint[]>;

    /**
     * Obtiene el sprint activo actual
     */
    getActive(): Promise<Sprint | null>;

    /**
     * Obtiene un sprint por su ID
     */
    getById(id: string): Promise<Sprint | null>;

    /**
     * Obtiene sprints cerrados recientes
     */
    getRecentClosed(limit: number): Promise<Sprint[]>;
}
