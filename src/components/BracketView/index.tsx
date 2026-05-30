import React from 'react';

interface BracketViewProps {
  token: string;
  userId: string;
  quinielaEnviada: boolean;
}

export const BracketView: React.FC<BracketViewProps> = ({ 
  token, 
  userId, 
  quinielaEnviada 
}) => {
  if (!quinielaEnviada) {
    return (
      <div className="bracket-placeholder">
        <h3>🔒 Vista de bracket disponible después de enviar tu quiniela</h3>
        <p>Completa y envía tus predicciones para ver la visualización gráfica</p>
      </div>
    );
  }

  return (
    <div className="bracket-view">
      <h2>🏆 Bracket - Llaves del Torneo</h2>
      <div className="bracket-container">
        {/* Aquí irá el bracket gráfico - lo implementarás después */}
        <div className="bracket-placeholder">
          Vista gráfica del bracket (octavos → cuartos → semis → final)
        </div>
      </div>
    </div>
  );
};