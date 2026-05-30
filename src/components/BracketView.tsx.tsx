// src/components/BracketView.tsx
import React, { useState, useEffect } from 'react';

interface BracketViewProps {
  token: string | null;
  userId: string;
  matches: any[];
}

export const BracketView: React.FC<BracketViewProps> = ({
  token,
  userId,
  matches,
}) => {
  const [userPredictions, setUserPredictions] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const fetchUserPredictions = async () => {
      try {
        const response = await fetch(
          `https://api.organizacion.com/teams/${token}/users/${userId}/quiniela`
        );
        if (response.ok) {
          const data = await response.json();
          setUserPredictions(data.predictions || {});
        }
      } catch {
        // Mock fallback de predicciones para representación visual en desarrollo
        setUserPredictions({ m1: 'home', m2: 'away', m3: 'home', m4: 'home' });
      }
    };
    fetchUserPredictions();
  }, [userId, token]);

  // Agrupación de los partidos por fase para construir las columnas del bracket
  const filterByStage = (stage: string) =>
    matches.filter((m) => m.stage === stage);

  const renderMatchCard = (match: any) => {
    const pred = userPredictions[match.id];

    return (
      <div
        key={match.id}
        style={{
          backgroundColor: '#fdfefe',
          border: '1px solid #dcdde1',
          borderRadius: '6px',
          padding: '10px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          minWidth: '200px',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            color: '#7f8c8d',
            marginBottom: '5px',
            fontWeight: 'bold',
          }}
        >
          ID: {match.id}
        </div>

        {/* Equipo Local */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4px 0',
            borderRadius: '4px',
            backgroundColor: pred === 'home' ? '#d4edda' : 'transparent',
          }}
        >
          <span>
            {match.homeTeam.flag} {match.homeTeam.name}
          </span>
          {pred === 'home' && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: '#155724',
              }}
            >
              🎯 Mi Pred
            </span>
          )}
        </div>

        <div
          style={{ height: '1px', backgroundColor: '#eee', margin: '4px 0' }}
        />

        {/* Equipo Visitante */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4px 0',
            borderRadius: '4px',
            backgroundColor: pred === 'away' ? '#d4edda' : 'transparent',
          }}
        >
          <span>
            {match.awayTeam.flag} {match.awayTeam.name}
          </span>
          {pred === 'away' && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: '#155724',
              }}
            >
              🎯 Mi Pred
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div
        style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '10px 15px',
          borderRadius: '6px',
          marginBottom: '20px',
          fontWeight: '500',
        }}
      >
        🔒 **Modo Vista (Lectura)**: Tu quiniela ha sido enviada con éxito. Los
        recuadros verdes reflejan tus predicciones guardadas.
      </div>

      {/* Contenedor Flex para emular las columnas del Bracket de forma adaptable/responsive */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          overflowX: 'auto',
          padding: '20px 0',
        }}
      >
        {/* Columna 1: Semifinales */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            justifyContent: 'center',
          }}
        >
          <h4
            style={{
              textAlign: 'center',
              margin: '0 0 10px 0',
              color: '#8a1538',
            }}
          >
            Semifinal
          </h4>
          {filterByStage('Semifinals').map(renderMatchCard)}
        </div>

        {/* Columna 2: Gran Final e Histórico */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '50px',
            justifyContent: 'center',
          }}
        >
          <div>
            <h4
              style={{
                textAlign: 'center',
                margin: '0 0 10px 0',
                color: '#d4ac0d',
              }}
            >
              🏆 Gran Final
            </h4>
            {filterByStage('Final').map(renderMatchCard)}
          </div>
        </div>
      </div>
    </div>
  );
};
