// src/App.tsx - VERSIÓN SIMPLIFICADA QUE FUNCIONA
import React, { useState, useEffect } from 'react';

function App() {
  const [token, setToken] = useState<string>('TEAM-TUNG-TUNG');
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [activeTab, setActiveTab] = useState('participants');

  // API URL
  const API_URL = 'https://hackathon-quiniela.onrender.com';

  // Cargar participantes
  const loadParticipants = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/participants`, {
        headers: { 'x-team-token': token },
      });

      console.log('Status:', response.status);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Participantes:', data);
      setParticipants(data);
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Crear participante
  const createParticipant = async () => {
    if (!newName.trim()) {
      setError('Escribe un nombre');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/participants`, {
        method: 'POST',
        headers: {
          'x-team-token': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName, photoUrl: null }),
      });

      console.log('Create status:', response.status);
      const data = await response.json();
      console.log('Respuesta:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      alert('✅ Participante creado!');
      setNewName('');
      loadParticipants();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Probar conexión a la API
  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/participants`, {
        headers: { 'x-team-token': token },
      });
      console.log('Test API - Status:', response.status);
      const text = await response.text();
      console.log('Respuesta:', text);
      alert(`Status: ${response.status}\nRespuesta: ${text.substring(0, 200)}`);
    } catch (err: any) {
      console.error(err);
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>🏆 Quiniela - Hackathon</h1>

      {/* Token info */}
      <div
        style={{
          background: '#f0f0f0',
          padding: 10,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <strong>Token:</strong> {token}
        <button
          onClick={testAPI}
          style={{ marginLeft: 10, padding: 5, cursor: 'pointer' }}
        >
          🔍 Probar API
        </button>
      </div>

      {/* Navegación */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('participants')}
          style={buttonStyle}
        >
          👥 Participantes
        </button>
        <button onClick={() => setActiveTab('quiniela')} style={buttonStyle}>
          📊 Quiniela
        </button>
      </div>

      {/* Mostrar error */}
      {error && (
        <div
          style={{
            background: '#fee',
            color: '#c00',
            padding: 10,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          ❌ {error}
        </div>
      )}

      {/* Loading */}
      {loading && <div>Cargando...</div>}

      {/* TABLA DE PARTICIPANTES */}
      {activeTab === 'participants' && (
        <div>
          <h2>Participantes</h2>

          {/* Formulario crear */}
          <div
            style={{
              background: '#f9f9f9',
              padding: 20,
              borderRadius: 8,
              marginBottom: 20,
            }}
          >
            <h3>➕ Nuevo Participante</h3>
            <input
              type="text"
              placeholder="Nombre"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ padding: 8, marginRight: 10, width: 200 }}
            />
            <button onClick={createParticipant} style={buttonGreenStyle}>
              Crear
            </button>
          </div>

          {/* Lista de participantes */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Quiniela</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p: any) => (
                <tr key={p.idParticipant}>
                  <td style={tdStyle}>{p.idParticipant}</td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>
                    {p.quinielaSubmitted ? '✅ Enviada' : '⏳ Pendiente'}
                  </td>
                </tr>
              ))}
              {participants.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: 20 }}>
                    No hay participantes. ¡Crea uno!
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <button
            onClick={loadParticipants}
            style={{ marginTop: 20, padding: 8, cursor: 'pointer' }}
          >
            🔄 Refrescar
          </button>
        </div>
      )}

      {/* QUINIELA (placeholder) */}
      {activeTab === 'quiniela' && (
        <div>
          <h2>Quiniela</h2>
          <p>
            Selecciona un participante primero en la pestaña "Participantes"
          </p>
          {participants.map((p: any) => (
            <div
              key={p.idParticipant}
              style={{
                padding: 10,
                border: '1px solid #ddd',
                margin: 5,
                borderRadius: 5,
                cursor: 'pointer',
              }}
            >
              {p.name} -{' '}
              {p.quinielaSubmitted ? 'Quiniela enviada' : 'Pendiente'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Estilos
const buttonStyle = {
  padding: '10px 20px',
  cursor: 'pointer',
  background: '#667eea',
  color: 'white',
  border: 'none',
  borderRadius: 8,
};

const buttonGreenStyle = {
  padding: '8px 16px',
  cursor: 'pointer',
  background: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: 5,
};

const thStyle = {
  border: '1px solid #ddd',
  padding: 12,
  textAlign: 'left' as const,
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: 10,
};

export default App;
