import { useState, useEffect, useCallback } from 'react';
import type { Prediction, QuinielaData } from './match.types';


interface UseQuinielaReturn {
  quiniela: QuinielaData | null;
  loading: boolean;
  error: string | null;
  saveQuiniela: (predicciones: Prediction[]) => Promise<void>;
  refreshQuiniela: () => Promise<void>;
}

export const useQuiniela = (userId: string | null, token: string): UseQuinielaReturn => {
  const [quiniela, setQuiniela] = useState<QuinielaData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshQuiniela = useCallback(async (): Promise<void> => {
    if (!userId || !token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await quinielaService.getByUser(userId, token);
      setQuiniela(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar la quiniela';
      setError(errorMessage);
      console.error('Error fetching quiniela:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, token]);

  const saveQuiniela = useCallback(async (predicciones: Prediction[]): Promise<void> => {
    if (!userId || !token) {
      throw new Error('Usuario o token no disponible');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await quinielaService.save(userId, token, predicciones);
      await refreshQuiniela(); // Recargar datos actualizados
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar la quiniela';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, token, refreshQuiniela]);

  useEffect(() => {
    refreshQuiniela();
  }, [refreshQuiniela]);

  return { quiniela, loading, error, saveQuiniela, refreshQuiniela };
};