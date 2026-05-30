export type AppErrorType = 'NETWORK' | 'VALIDATION' | 'DUPLICATE' | 'SERVER' | 'UNKNOWN';

export interface AppError {
  type: AppErrorType;
  message: string;
  originalError?: unknown;
}

export const handleApiError = (error: unknown): AppError => {
  if (error instanceof Error) {
    if (error.message.includes('conectar') || error.message.includes('network')) {
      return { type: 'NETWORK', message: '🔌 Sin conexión. Verifica internet.' };
    }
    if (error.message.includes('duplicate') || error.message.includes('ya existe')) {
      return { type: 'DUPLICATE', message: '👥 Este usuario ya existe en tu equipo.' };
    }
    if (error.message.includes('valid')) {
      return { type: 'VALIDATION', message: error.message };
    }
    return { type: 'SERVER', message: error.message };
  }
  
  return { type: 'UNKNOWN', message: '❌ Error inesperado. Recarga la página.' };
};

export const getErrorMessage = (error: AppError): string => error.message;