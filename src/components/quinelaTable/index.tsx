import React, { useState } from 'react';
import { Match, Prediction } from '../../types/match.types';

interface QuinielaTableProps {
  token: string;
  userId?: string;
}

export const QuinielaTable: React.FC<QuinielaTableProps> = ({ token, userId }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  // Temporal
  if (loading) return <div>Cargando partidos...</div>;

  return (
    <div>
      <h2>Quiniela - Modo Tabla</h2>
      <table className="quiniela-table">
        <thead>
          <tr>
            <th>Local</th>
            <th>Visitante</th>
            <th>Ganador Real</th>
            <th>Tu Predicción</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {matches.map(match => (
            <tr key={match.id}>
              <td>{match.local}</td>
              <td>{match.visitante}</td>
              <td>{match.ganador_real || '-'}</td>
              <td>
                <select disabled={match.estado !== 'No Finalizado'}>
                  <option value="">Seleccionar</option>
                  <option value={match.local}>{match.local}</option>
                  <option value={match.visitante}>{match.visitante}</option>
                </select>
              </td>
              <td>{match.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};