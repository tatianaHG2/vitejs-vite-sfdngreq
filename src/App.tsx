// src/App.tsx - Flujo completo con token TEAM-TUNG-TUNG
import React, { useState, useEffect } from 'react';

// ========== TOKEN POR DEFECTO ==========
const DEFAULT_TOKEN = 'TEAM-TUNG-TUNG';

// ========== API CONFIG ==========
const API_URL = 'https://hackathon-quiniela.onrender.com';

// ========== TIPOS ==========
interface Participant {
  idParticipant: number;
  name: string;
  photoUrl: string | null;
  teamId: number;
  quinielaSubmitted: boolean;
  createdAt: string;
}

interface FootballTeam {
  idFootballTeam: number;
  name: string;
  countryCode: string;
  flagUrl: string;
}

interface Match {
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

interface BracketStage {
  stage: string;
  matches: Match[];
}

interface QuinielaData {
  participant: { idParticipant: number; name: string; photoUrl: string | null };
  submitted: boolean;
  score: number;
  bracket: BracketStage[];
}

interface LeaderboardEntry {
  idParticipant: number;
  name: string;
  photoUrl: string | null;
  score: number;
  submitted: boolean;
  teamName?: string;
}

// ========== GRUPOS DEL MUNDIAL 2026 ==========
const WORLD_CUP_GROUPS = {
  GRUPO_1: { name: "GRUPO 1", teams: ["México", "Sudáfrica", "Corea del Sur", "Rep. Checa"] },
  GRUPO_2: { name: "GRUPO 2", teams: ["Canadá", "Bosnia", "Qatar", "Suiza"] },
  GRUPO_3: { name: "GRUPO 3", teams: ["Brasil", "Marruecos", "Haití", "Escocia"] },
  GRUPO_4: { name: "GRUPO 4", teams: ["Estados Unidos", "Paraguay", "Australia", "Turquía"] },
  GRUPO_5: { name: "GRUPO 5", teams: ["Alemania", "Curazao", "Costa de Marfil", "Ecuador"] },
  GRUPO_6: { name: "GRUPO 6", teams: ["Países Bajos", "Japón", "Suecia", "Túnez"] },
  GRUPO_7: { name: "GRUPO 7", teams: ["Bélgica", "Egipto", "Irán", "Nueva Zelanda"] },
  GRUPO_8: { name: "GRUPO 8", teams: ["España", "Cabo Verde", "Arabia Saudita", "Uruguay"] },
  GRUPO_9: { name: "GRUPO 9", teams: ["Francia", "Senegal", "Irak", "Noruega"] },
  GRUPO_10: { name: "GRUPO 10", teams: ["Argentina", "Argelia", "Austria", "Jordania"] },
  GRUPO_11: { name: "GRUPO 11", teams: ["Portugal", "RD Congo", "Uzbekistán", "Colombia"] },
  GRUPO_12: { name: "GRUPO 12", teams: ["Inglaterra", "Croacia", "Ghana", "Panamá"] },
  GRUPO_13: { name: "GRUPO 13", teams: ["Olí", "FIFA"] }
};

const FLAGS: Record<string, string> = {
  'México': '🇲🇽', 'Sudáfrica': '🇿🇦', 'Corea del Sur': '🇰🇷', 'Rep. Checa': '🇨🇿',
  'Canadá': '🇨🇦', 'Bosnia': '🇧🇦', 'Qatar': '🇶🇦', 'Suiza': '🇨🇭',
  'Brasil': '🇧🇷', 'Marruecos': '🇲🇦', 'Haití': '🇭🇹', 'Escocia': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Estados Unidos': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Turquía': '🇹🇷',
  'Alemania': '🇩🇪', 'Curazao': '🇨🇼', 'Costa de Marfil': '🇨🇮', 'Ecuador': '🇪🇨',
  'Países Bajos': '🇳🇱', 'Japón': '🇯🇵', 'Suecia': '🇸🇪', 'Túnez': '🇹🇳',
  'Bélgica': '🇧🇪', 'Egipto': '🇪🇬', 'Irán': '🇮🇷', 'Nueva Zelanda': '🇳🇿',
  'España': '🇪🇸', 'Cabo Verde': '🇨🇻', 'Arabia Saudita': '🇸🇦', 'Uruguay': '🇺🇾',
  'Francia': '🇫🇷', 'Senegal': '🇸🇳', 'Irak': '🇮🇶', 'Noruega': '🇳🇴',
  'Argentina': '🇦🇷', 'Argelia': '🇩🇿', 'Austria': '🇦🇹', 'Jordania': '🇯🇴',
  'Portugal': '🇵🇹', 'RD Congo': '🇨🇩', 'Uzbekistán': '🇺🇿', 'Colombia': '🇨🇴',
  'Inglaterra': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croacia': '🇭🇷', 'Ghana': '🇬🇭', 'Panamá': '🇵🇦',
  'Olí': '⚽', 'FIFA': '🎮'
};

// ========== COMPONENTE DE GRUPOS ==========
const GroupsView: React.FC = () => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const allTeams = Object.values(WORLD_CUP_GROUPS).flatMap(g => g.teams);
  const filteredTeams = allTeams.filter(team =>
    team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="groups-container">
      <h2>🏆 MUNDIAL 2026 - FASE DE GRUPOS</h2>
      <p className="subtitle">48 selecciones | 13 grupos</p>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Buscar equipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm && (
        <div className="search-results">
          <h3>Resultados:</h3>
          <div className="search-teams">
            {filteredTeams.map(team => (
              <div key={team} className="team-item-small" onClick={() => setSelectedTeam(team)}>
                <span className="team-flag">{FLAGS[team] || '🏳️'}</span>
                {team}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="groups-grid">
        {Object.entries(WORLD_CUP_GROUPS).map(([key, group]) => (
          <div key={key} className="group-card">
            <div className="group-header">{group.name}</div>
            <div className="teams-list">
              {group.teams.map((team, idx) => (
                <div key={idx} className={`team-item ${selectedTeam === team ? 'selected' : ''}`}
                     onClick={() => setSelectedTeam(team)}>
                  <span className="team-flag">{FLAGS[team] || '🏳️'}</span>
                  <span className="team-name">{team}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ========== COMPONENTE PARA CREAR QUINIELA ==========
const CreateQuiniela: React.FC<{ token: string; participantId: number; onBack: () => void }> = ({ 
  token, participantId, onBack 
}) => {
  const [bracket, setBracket] = useState<BracketStage[]>([]);
  const [predictions, setPredictions] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadBracket = async () => {
    try {
      const response = await fetch(`${API_URL}/matches/bracket`, {
        headers: { 'x-team-token': token }
      });
      const data = await response.json();
      setBracket(data.bracket);
    } catch (err) {
      setError('Error al cargar partidos');
    } finally {
      setLoading(false);
    }
  };

  const saveQuiniela = async () => {
    const allMatches = bracket.flatMap(s => s.matches);
    const pendingMatches = allMatches.filter(m => m.status === 'pending');
    const missing = pendingMatches.filter(m => !predictions[m.idMatch]);
    
    if (missing.length > 0) {
      setError(`Faltan ${missing.length} predicciones por seleccionar`);
      return;
    }

    setSaving(true);
    try {
      const predictionsArray = Object.entries(predictions).map(([matchId, teamId]) => ({
        matchId: parseInt(matchId),
        predictedWinnerId: teamId
      }));

      const response = await fetch(`${API_URL}/quiniela`, {
        method: 'POST',
        headers: {
          'x-team-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ participantId, predictions: predictionsArray })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      alert('✅ ¡Quiniela enviada con éxito!');
      onBack();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadBracket();
  }, []);

  if (loading) return <div className="loading">Cargando bracket de partidos...</div>;

  return (
    <div>
      <button onClick={onBack} className="back-btn">← Volver</button>
      <h2>📝 Crear Quiniela</h2>
      <p>Selecciona el ganador de cada partido (16 partidos en total)</p>
      
      {error && <div className="error">{error}</div>}
      
      {bracket.map(stage => (
        <div key={stage.stage} className="round-section">
          <h3>{stage.stage.toUpperCase()}</h3>
          <div className="matches-grid">
            {stage.matches.map(match => {
              const isFinished = match.status === 'finished';
              const hasTeams = match.homeTeam && match.awayTeam;
              
              return (
                <div key={match.idMatch} className="match-card">
                  <div className="match-teams">
                    <div className="team-home">
                      {match.homeTeam?.name || 'TBD'}
                    </div>
                    <div className="vs">VS</div>
                    <div className="team-away">
                      {match.awayTeam?.name || 'TBD'}
                    </div>
                  </div>
                  <select
                    value={predictions[match.idMatch] || ''}
                    onChange={(e) => setPredictions({...predictions, [match.idMatch]: parseInt(e.target.value)})}
                    disabled={isFinished || !hasTeams}
                    className="winner-select"
                  >
                    <option value="">Seleccionar ganador</option>
                    {match.homeTeam && (
                      <option value={match.homeTeam.idFootballTeam}>{match.homeTeam.name}</option>
                    )}
                    {match.awayTeam && (
                      <option value={match.awayTeam.idFootballTeam}>{match.awayTeam.name}</option>
                    )}
                  </select>
                  <div className="match-status">{match.status}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      <button onClick={saveQuiniela} disabled={saving} className="save-btn">
        {saving ? 'Enviando...' : '📤 Enviar Quiniela'}
      </button>
    </div>
  );
};

// ========== COMPONENTE PARA VER QUINIELA ENVIADA ==========
const ViewQuiniela: React.FC<{ token: string; participantId: number; onBack: () => void }> = ({ 
  token, participantId, onBack 
}) => {
  const [quiniela, setQuiniela] = useState<QuinielaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadQuiniela = async () => {
    try {
      const response = await fetch(`${API_URL}/quiniela/${participantId}`, {
        headers: { 'x-team-token': token }
      });
      if (!response.ok) throw new Error('No se encontró la quiniela');
      const data = await response.json();
      setQuiniela(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiniela();
  }, []);

  if (loading) return <div className="loading">Cargando tu quiniela...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!quiniela) return <div className="info">No se encontró la quiniela</div>;

  return (
    <div>
      <button onClick={onBack} className="back-btn">← Volver</button>
      <h2>🏆 Mi Quiniela - {quiniela.participant.name}</h2>
      <div className="score-card">Puntaje total: {quiniela.score} pts</div>
      
      {quiniela.bracket.map(stage => (
        <div key={stage.stage} className="round-section">
          <h3>{stage.stage.toUpperCase()}</h3>
          <div className="matches-grid">
            {stage.matches.map(match => {
              const isCorrect = match.prediction?.isCorrect;
              
              return (
                <div key={match.idMatch} className={`match-card ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
                  <div className="match-teams">
                    <div className="team-home">{match.homeTeam?.name || 'TBD'}</div>
                    <div className="vs">VS</div>
                    <div className="team-away">{match.awayTeam?.name || 'TBD'}</div>
                  </div>
                  <div className="result-real">
                    Ganador real: {match.winner?.name || 'Pendiente'}
                  </div>
                  <div className="result-prediction">
                    Tu predicción: {match.prediction?.predictedWinner?.name || 'No enviada'}
                    {isCorrect === true && ' ✓ Acertaste!'}
                    {isCorrect === false && ' ✗ Fallaste'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ========== COMPONENTE DE PARTICIPANTES ==========
const ParticipantsView: React.FC<{ 
  token: string; 
  onSelectParticipant: (id: number, submitted: boolean) => void;
  selectedId: number | null;
}> = ({ token, onSelectParticipant, selectedId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [creating, setCreating] = useState(false);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/participants`, {
        headers: { 'x-team-token': token }
      });
      if (!response.ok) throw new Error('Error al cargar');
      const data = await response.json();
      setParticipants(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createParticipant = async () => {
    if (!newName.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setCreating(true);
    try {
      const response = await fetch(`${API_URL}/participants`, {
        method: 'POST',
        headers: {
          'x-team-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName, photoUrl: null })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      setNewName('');
      await loadParticipants();
      alert('✅ Participante creado exitosamente');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [token]);

  return (
    <div>
      <h2>👥 Participantes del Equipo</h2>
      <p className="subtitle">Token: <strong>{token}</strong></p>
      {error && <div className="error">{error}</div>}
      
      <div className="create-form">
        <input
          type="text"
          placeholder="Nombre del participante"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={creating}
        />
        <button onClick={createParticipant} disabled={creating}>
          {creating ? 'Creando...' : '+ Registrar Participante'}
        </button>
      </div>

      <div className="participants-list">
        {participants.map(p => (
          <div key={p.idParticipant} 
               className={`participant-card ${selectedId === p.idParticipant ? 'selected' : ''}`}
               onClick={() => onSelectParticipant(p.idParticipant, p.quinielaSubmitted)}>
            <div>
              <div className="participant-name">{p.name}</div>
              <div className="participant-status">
                {p.quinielaSubmitted ? '✅ Quiniela enviada' : '⏳ Pendiente'}
              </div>
            </div>
            <button className="select-btn">
              {p.quinielaSubmitted ? 'Ver Quiniela' : 'Crear Quiniela'}
            </button>
          </div>
        ))}
        {participants.length === 0 && (
          <div className="empty-state">No hay participantes registrados</div>
        )}
      </div>
      
      <button onClick={loadParticipants} className="refresh-btn">🔄 Refrescar</button>
    </div>
  );
};

// ========== COMPONENTE DE LEADERBOARDS ==========
const LeaderboardView: React.FC<{ token: string }> = ({ token }) => {
  const [tokenRanking, setTokenRanking] = useState<LeaderboardEntry[]>([]);
  const [globalRanking, setGlobalRanking] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLeaderboard, setActiveLeaderboard] = useState<'token' | 'global'>('token');

  const loadLeaderboards = async () => {
    setLoading(true);
    try {
      const [tokenRes, globalRes] = await Promise.all([
        fetch(`${API_URL}/leaderboard/token`, { headers: { 'x-team-token': token } }),
        fetch(`${API_URL}/leaderboard/general`, { headers: { 'x-team-token': token } })
      ]);
      
      if (tokenRes.ok) setTokenRanking(await tokenRes.json());
      if (globalRes.ok) setGlobalRanking(await globalRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboards();
  }, [token]);

  if (loading) return <div className="loading">Cargando rankings...</div>;

  const currentRanking = activeLeaderboard === 'token' ? tokenRanking : globalRanking;

  return (
    <div>
      <div className="leaderboard-tabs">
        <button className={activeLeaderboard === 'token' ? 'active' : ''} 
                onClick={() => setActiveLeaderboard('token')}>
          🏅 Ranking del Equipo
        </button>
        <button className={activeLeaderboard === 'global' ? 'active' : ''} 
                onClick={() => setActiveLeaderboard('global')}>
          🌍 Ranking Global
        </button>
      </div>

      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Participante</th>
            {activeLeaderboard === 'global' && <th>Equipo</th>}
            <th>Puntaje</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {currentRanking.map((entry, idx) => (
            <tr key={entry.idParticipant} className={idx === 0 ? 'first-place' : ''}>
              <td>{idx + 1}°</td>
              <td>{entry.name}</td>
              {activeLeaderboard === 'global' && <td>{entry.teamName || '-'}</td>}
              <td><strong>{entry.score}</strong> pts</td>
              <td>{entry.submitted ? '✅' : '⏳'}</td>
            </tr>
          ))}
          {currentRanking.length === 0 && (
            <tr><td colSpan={4} className="empty-state">Sin datos</td></tr>
          )}
        </tbody>
      </table>
      
      <button onClick={loadLeaderboards} className="refresh-btn">🔄 Refrescar</button>
    </div>
  );
};

// ========== APP PRINCIPAL ==========
function App() {
  const [token, setToken] = useState<string>(DEFAULT_TOKEN);
  const [selectedParticipant, setSelectedParticipant] = useState<{ id: number; submitted: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<'groups' | 'participants' | 'quiniela' | 'leaderboard'>('groups');

  const handleSelectParticipant = (id: number, submitted: boolean) => {
    setSelectedParticipant({ id, submitted });
    setActiveTab('quiniela');
  };

  return (
    <div className="app">
      <header>
        <h1>🏆 Mundial 2026 - Quiniela</h1>
        <div className="token-badge">🔑 Token: {token}</div>
        <nav>
          <button className={activeTab === 'groups' ? 'active' : ''} onClick={() => setActiveTab('groups')}>
            🏆 Grupos
          </button>
          <button className={activeTab === 'participants' ? 'active' : ''} onClick={() => setActiveTab('participants')}>
            👥 Participantes
          </button>
          <button className={activeTab === 'quiniela' ? 'active' : ''} onClick={() => setActiveTab('quiniela')}>
            📊 Quiniela
          </button>
          <button className={activeTab === 'leaderboard' ? 'active' : ''} onClick={() => setActiveTab('leaderboard')}>
            🏅 Rankings
          </button>
        </nav>
      </header>

      <main>
        {activeTab === 'groups' && <GroupsView />}
        
        {activeTab === 'participants' && (
          <ParticipantsView 
            token={token} 
            onSelectParticipant={handleSelectParticipant}
            selectedId={selectedParticipant?.id || null}
          />
        )}
        
        {activeTab === 'quiniela' && (
          selectedParticipant ? (
            selectedParticipant.submitted ? (
              <ViewQuiniela 
                token={token} 
                participantId={selectedParticipant.id} 
                onBack={() => setActiveTab('participants')}
              />
            ) : (
              <CreateQuiniela 
                token={token} 
                participantId={selectedParticipant.id} 
                onBack={() => setActiveTab('participants')}
              />
            )
          ) : (
            <div className="info">
              <p>👆 Selecciona un participante en la pestaña "Participantes"</p>
              <button onClick={() => setActiveTab('participants')} className="select-btn">
                Ir a Participantes
              </button>
            </div>
          )
        )}
        
        {activeTab === 'leaderboard' && <LeaderboardView token={token} />}
      </main>

      <footer>
        <p>🏆 Mundial 2026 - 48 selecciones | 13 grupos | 16 partidos</p>
      </footer>

      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          min-height: 100vh;
        }
        
        .app {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }
        
        header {
          background: linear-gradient(135deg, #0f3460 0%, #533483 100%);
          color: white;
          padding: 20px 30px;
          border-radius: 20px;
          margin-bottom: 25px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        
        h1 { font-size: 1.8rem; margin-bottom: 10px; }
        h2 { color: #333; margin-bottom: 20px; }
        h3 { margin: 20px 0 15px 0; color: #555; }
        
        .token-badge {
          background: rgba(255,255,255,0.2);
          padding: 5px 12px;
          border-radius: 20px;
          display: inline-block;
          margin: 10px 0;
          font-size: 14px;
        }
        
        .subtitle {
          color: #666;
          margin-bottom: 15px;
          font-size: 14px;
        }
        
        nav {
          display: flex;
          gap: 12px;
          margin-top: 15px;
          flex-wrap: wrap;
        }
        
        nav button {
          background: rgba(255,255,255,0.15);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 30px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s;
        }
        
        nav button:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }
        
        nav button.active {
          background: #e94560;
          box-shadow: 0 4px 15px rgba(233,69,96,0.4);
        }
        
        main {
          background: white;
          border-radius: 20px;
          padding: 30px;
          min-height: 550px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        
        footer {
          text-align: center;
          margin-top: 20px;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
        }
        
        /* Grupos */
        .groups-container { animation: fadeIn 0.5s ease; }
        .groups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .group-card {
          background: #f8f9fa;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .group-header {
          background: linear-gradient(135deg, #e94560 0%, #533483 100%);
          color: white;
          padding: 12px;
          font-weight: bold;
          text-align: center;
        }
        
        .teams-list { padding: 12px; }
        
        .team-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: white;
          border-radius: 10px;
          margin-bottom: 5px;
          cursor: pointer;
          border: 1px solid #e0e0e0;
        }
        
        .team-item:hover { background: #e94560; color: white; }
        .team-item.selected { background: #e94560; color: white; }
        .team-flag { font-size: 1.3rem; }
        .team-name { font-size: 0.85rem; }
        
        .search-box input {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 30px;
          font-size: 15px;
        }
        
        .search-results {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 15px;
          margin: 15px 0;
        }
        
        .search-teams { display: flex; flex-wrap: wrap; gap: 8px; }
        
        .team-item-small {
          background: white;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          border: 1px solid #ddd;
        }
        
        /* Participantes */
        .create-form {
          display: flex;
          gap: 12px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }
        
        .create-form input {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 12px;
        }
        
        .create-form input:focus { outline: none; border-color: #e94560; }
        
        .create-form button, .save-btn, .refresh-btn, .back-btn {
          padding: 12px 24px;
          background: #e94560;
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .back-btn { background: #6b7280; margin-bottom: 20px; }
        .refresh-btn { background: #6b7280; margin-top: 20px; }
        
        .participants-list { display: flex; flex-direction: column; gap: 12px; }
        
        .participant-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background: #f8f9fa;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          cursor: pointer;
        }
        
        .participant-card.selected { background: #e94560; color: white; }
        .participant-name { font-weight: 600; font-size: 1rem; }
        .participant-status { font-size: 0.8rem; color: #666; }
        
        .select-btn {
          padding: 6px 16px;
          background: #e94560;
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
        }
        
        /* Quiniela */
        .matches-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
        }
        
        .match-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 15px;
          border-left: 4px solid #ccc;
        }
        
        .match-card.correct { border-left-color: #10b981; background: #f0fdf4; }
        .match-card.incorrect { border-left-color: #ef4444; background: #fef2f2; }
        
        .match-teams {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-weight: bold;
        }
        
        .team-home, .team-away { flex: 1; }
        .vs { color: #999; font-size: 12px; }
        
        .winner-select {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid #ddd;
          margin: 10px 0;
        }
        
        .match-status { font-size: 12px; color: #666; }
        .result-real, .result-prediction { font-size: 13px; margin-top: 5px; }
        
        .score-card {
          background: #10b981;
          color: white;
          padding: 15px;
          border-radius: 12px;
          text-align: center;
          font-size: 1.3rem;
          margin-bottom: 20px;
        }
        
        /* Leaderboard */
        .leaderboard-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .leaderboard-tabs button {
          padding: 10px 20px;
          background: #f0f0f0;
          border: none;
          border-radius: 30px;
          cursor: pointer;
        }
        
        .leaderboard-tabs button.active { background: #e94560; color: white; }
        
        .leaderboard-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .leaderboard-table th, .leaderboard-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        
        .leaderboard-table th { background: #f5f5f5; }
        .first-place { background: #fef3c7; }
        
        .round-section { margin-bottom: 30px; }
        
        .error {
          background: #fee;
          color: #c00;
          padding: 12px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        
        .loading, .info, .empty-state {
          text-align: center;
          padding: 50px;
          color: #666;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .groups-grid { grid-template-columns: 1fr; }
          .matches-grid { grid-template-columns: 1fr; }
          h1 { font-size: 1.3rem; }
          nav button { padding: 8px 16px; font-size: 13px; }
        }
      `}</style>
    </div>
  );
}

export default App;