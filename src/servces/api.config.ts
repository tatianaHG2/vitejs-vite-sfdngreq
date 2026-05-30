import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.ejemplo.com/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor de respuesta para manejo centralizado de errores
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (!error.response) {
          // Error de red
          throw new Error('❌ No se pudo conectar con el servidor. Verifica tu conexión.');
        }
        
        switch (error.response.status) {
          case 400:
            throw new Error(error.response.data?.message || 'Solicitud incorrecta');
          case 404:
            throw new Error('Recurso no encontrado');
          case 409:
            throw new Error('Conflicto: El usuario ya existe en este equipo');
          case 500:
            throw new Error('Error interno del servidor. Intenta más tarde');
          default:
            throw new Error(error.response.data?.message || 'Error inesperado');
        }
      }
    );
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

export const apiClient = new ApiClient().getClient();