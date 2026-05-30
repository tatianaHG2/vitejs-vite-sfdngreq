import { useState, useEffect, useCallback } from 'react';
import type { LeaderboardEntry } from './type';

interface UseLeaderboardReturn {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useLeaderboard = (
  type: 'token' | 'global',
  token?: string
): UseLeaderboardReturn => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (): Promise<void> => {
    if (type === 'token' && !token) return;

    setLoading(true);
    setError(null);

    try {
      let data: LeaderboardEntry[];
      if (type === 'token' && token) {
        data = await leaderboardService.getByToken(token);
      } else {
        data = await leaderboardService.getGlobal();
      }
      setEntries(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error al cargar leaderboard';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [type, token]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { entries, loading, error, refresh };
};
