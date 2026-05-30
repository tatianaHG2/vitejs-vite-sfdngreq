// src/services/matchService.ts
const API_URL = 'https://hackathon-quiniela.onrender.com';

// Función para traducir errores al español
const translateError = (message: string): string => {
  const errorMap: Record<string, string> = {
    'Token de equipo no válido': '❌ Token de equipo no válido. Verifica tu token.',
    'Token not found': '❌ Token no encontrado. Contacta al organizador.',
    'Network request failed': '🔌 Error de red. Verifica tu conexión a internet.',
    'Failed to fetch': '🔌 No se pudo conectar con el servidor. Verifica tu internet.',
    'Internal server error': '⚠️ Error interno del servidor. Intenta más tarde.',
    'matches not found': '📋 No se encontraron partidos disponibles.',
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return `❌ ${message}`;
};

export const matchService = {
  // Obtener bracket de partidos
  async getBracket(token: string): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/matches/bracket`, {
        method: 'GET',
        headers: { 
          'x-team-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(translateError(errorMessage));
      }
      
      return response.json();
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        throw new Error(translateError('Failed to fetch'));
      }
      throw err;
    }
  }
};