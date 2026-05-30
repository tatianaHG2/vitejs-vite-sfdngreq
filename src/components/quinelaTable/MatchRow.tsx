import React from 'react';
import { Match, Prediction } from '../../types/match.types';

interface MatchRowProps {
  match: Match;
  selectedWinner: string | undefined;
  onSelectWinner: (matchId: string, winner: string) => void;
  disabled: boolean;
}

export const MatchRow: React.FC<MatchRowProps> = ({
  match,
  selectedWinner,
  onSelectWinner,
  disabled,
}) => {
  const isMatchFinished = match.estado === 'Finalizado';
  const canEdit = !isMatchFinished && !disabled;

  return (
    <tr className={`match-row ${isMatchFinished ? 'finished' : 'pending'}`}>
      <td>{match.local}</td>
      <td>{match.visitante}</td>
      <td>
        {isMatchFinished && match.ganador_real && (
          <span className="real-winner">✓ {match.ganador_real}</span>
        )}
      </td>
      <td>
        <select
          value={selectedWinner || ''}
          onChange={(e) => onSelectWinner(match.id, e.target.value)}
          disabled={!canEdit}
          className={!canEdit ? 'disabled-select' : ''}
        >
          <option value="">Seleccionar ganador</option>
          <option value={match.local}>{match.local}</option>
          <option value={match.visitante}>{match.visitante}</option>
        </select>
      </td>
      <td>{match.estado}</td>
    </tr>
  );
};
