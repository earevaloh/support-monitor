import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

/**
 * Cliente HTTP configurado para llamadas a APIs
 */
export class HttpClient {
    private client: AxiosInstance;

    constructor(baseURL: string, config?: AxiosRequestConfig) {
        this.client = axios.create({
            baseURL,
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
                ...config?.headers,
            },
            ...config,
        });

        this.setupInterceptors();
    }

    /**
     * Configura interceptores para manejo de requests y responses
     */
    private setupInterceptors(): void {
        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                // Aquí se puede agregar logging, tokens, etc.
                console.log(
                    `[HTTP] ${config.method?.toUpperCase()} ${config.url}`
                );
                return config;
            },
            (error) => {
                console.error("[HTTP] Request error:", error);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => {
                console.log(`[HTTP] Response: ${response.status}`);
                return response;
            },
            (error) => {
                console.error(
                    "[HTTP] Response error:",
                    error.response?.status,
                    error.message
                );
                return Promise.reject(error);
            }
        );
    }

    /**
     * Realiza una petición GET
     */
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    /**
     * Realiza una petición POST
     */
    async post<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    /**
     * Realiza una petición PUT
     */
    async put<T>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    /**
     * Realiza una petición DELETE
     */
    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }

    /**
     * Obtiene la instancia de Axios para casos especiales
     */
    getInstance(): AxiosInstance {
        return this.client;
    }
}
