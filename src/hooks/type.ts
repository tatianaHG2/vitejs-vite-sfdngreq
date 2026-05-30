// types.ts
export interface User {
  id: string;
  nombre: string;
  avatar_url: string;
  quiniela_enviada: boolean;
  puntaje?: number;
}

export interface Match {
  id: string;
  local: string;
  visitante: string;
  ronda: 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'tercer_lugar';
  estado: 'No Finalizado' | 'Finalizado';
  ganador_real?: string;
}

export interface Prediction {
  match_id: string;
  ganador_seleccionado: string;
}

export interface LeaderboardEntry {
  user_id: string;
  nombre: string;
  puntaje: number;
  posicion: number;
}