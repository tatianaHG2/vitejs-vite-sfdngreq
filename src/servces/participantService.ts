// src/services/.ts
import { Participant, CreateParticipantDto } from '../types/participant.types';

const API_URL = 'https://hackathon-quiniela.onrender.com';

// Función para traducir errores al español
const translateError = (message: string): string => {
  const errorMap: Record<string, string> = {
    'Token de equipo no válido': '❌ Token de equipo no válido. Verifica tu token.',
    'Token not found': '❌ Token no encontrado. Contacta al organizador del hackathon.',
    'Participant not found': '❌ Participante no encontrado en el sistema.',
    'Participant not found in this team': '❌ El participante no pertenece a tu equipo.',
    'Ya existe un participante con el nombre': '⚠️ Ya existe un participante con ese nombre en tu equipo.',
    'participant with this name already exists': '⚠️ Ya existe un participante con ese nombre en tu equipo.',
    'This participant already submitted their quiniela': '⚠️ Este participante ya envió su quiniela y no puede modificarla.',
    'This participant already registered their quiniela': '⚠️ Este participante ya registró su quiniela y no puede modificarla.',
    'Match already finished': '⚠️ Este partido ya finalizó y no se puede predecir.',
    'Invalid predicted winner': '❌ El equipo seleccionado no es válido para este partido.',
    'Team does not exist in this match': '❌ El equipo seleccionado no participa en este partido.',
    'Network request failed': '🔌 Error de red. Verifica tu conexión a internet.',
    'Failed to fetch': '🔌 No se pudo conectar con el servidor. Verifica tu internet.',
    'Internal server error': '⚠️ Error interno del servidor. Intenta más tarde.',
    'Body cannot be empty': '✅ No se requiere contenido adicional para esta acción.',
    'participantId must be a number': '❌ ID de participante inválido.',
    'matchId must be a number': '❌ ID de partido inválido.',
    'predictedWinnerId must be a number': '❌ ID de equipo ganador inválido.',
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return `❌ ${message}`;
};

// Servicio de participantes
export const participantService = {

  // Crear un nuevo participante
  async create(token: string, data: CreateParticipantDto): Promise<Participant> {
    try {
      const response = await fetch(`${API_URL}/participants`, {
        method: 'POST',
        headers: {
          'x-team-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
      
      const result = await response.json();
      return result;
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        throw new Error(translateError('Failed to fetch'));
      }
      throw err;
    }
  },

  // ELIMINAR un participante por ID - CORREGIDO (sin Content-Type)
  async delete(token: string, participantId: number): Promise<{ message: string }> {
    try {
      // Para DELETE sin body, NO enviamos Content-Type
      const response = await fetch(`${API_URL}/participants/${participantId}`, {
        method: 'DELETE',
        headers: {
          'x-team-token': token
          // IMPORTANTE: No incluir 'Content-Type' cuando no hay body
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
      
      // Intentar obtener respuesta si existe
      const text = await response.text();
      if (text) {
        try {
          return JSON.parse(text);
        } catch {
          return { message: 'Participante eliminado correctamente' };
        }
      }
      return { message: '✅ Participante eliminado correctamente' };
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message.includes('fetch')) {
        throw new Error(translateError('Failed to fetch'));
      }
      throw err;
    }
  },

  // Obtener quiniela de un participante
  async getQuiniela(token: string, participantId: number): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/quiniela/${participantId}`, {
        method: 'GET',
        headers: { 
          'x-team-token': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        if (response.status === 404) {
          throw new Error('📝 Este participante aún no ha enviado su quiniela.');
        }
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
  },

  // Enviar quiniela
  async saveQuiniela(token: string, participantId: number, predictions: any[]): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/quiniela`, {
        method: 'POST',
        headers: {
          'x-team-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ participantId, predictions })
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