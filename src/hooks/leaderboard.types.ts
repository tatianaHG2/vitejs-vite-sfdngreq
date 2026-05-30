export interface LeaderboardEntry {
  user_id: string;
  nombre: string;
  puntaje: number;
  token_equipo?: string;
  posicion: number;
}

export interface LeaderboardResponse {
  token: string;
  usuarios: LeaderboardEntry[];
}