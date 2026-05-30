export type MatchStatus = 'No Finalizado' | 'Finalizado' | 'En Vivo';

export interface Match {
  id: string;
  local: string;
  visitante: string;
  ronda: 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'tercer_lugar';
  estado: MatchStatus;
  ganador_real?: string;
  fecha?: string;
}

export interface Prediction {
  match_id: string;
  ganador_seleccionado: string;
}

export interface QuinielaData {
  user_id: string;
  predicciones: Prediction[];
  puntaje_total?: number;
}
