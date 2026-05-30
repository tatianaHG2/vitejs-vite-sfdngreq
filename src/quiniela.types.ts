// src/types/quiniela.types.ts
export interface FootballTeam {
  idFootballTeam: number;
  name: string;
  countryCode: string;
  flagUrl: string;
}

export interface Match {
  idMatch: number;
  matchOrder: number;
  homeTeam: FootballTeam | null;
  awayTeam: FootballTeam | null;
  matchDate: string;
  status: 'pending' | 'finished' | 'tbd';
  winner: FootballTeam | null;
  prediction?: {
    idPrediction: number;
    predictedWinner: FootballTeam;
    isCorrect: boolean | null;
  } | null;
}

export interface BracketStage {
  stage: 'octavos' | 'cuartos' | 'semifinal' | 'tercer_lugar' | 'final';
  matches: Match[];
}

export interface Participant {
  idParticipant: number;
  name: string;
  photoUrl: string | null;
  teamId: number;
  quinielaSubmitted: boolean;
  createdAt: string;
}

export interface QuinielaResponse {
  participant: {
    idParticipant: number;
    name: string;
    photoUrl: string | null;
  };
  submitted: boolean;
  score: number;
  bracket: BracketStage[];
}

export interface LeaderboardEntry {
  idParticipant: number;
  name: string;
  photoUrl: string | null;
  score: number;
  submitted: boolean;
  teamName?: string;
}