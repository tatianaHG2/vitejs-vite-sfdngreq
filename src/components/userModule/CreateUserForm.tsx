// App.tsx - Versión corregida
import React, { useState, useEffect } from "react";

// Importa directamente los archivos (no las carpetas)
import { UserModule } from "./components/UserModule/UserModule";
import { QuinielaTable } from "./components/QuinielaTable/QuinielaTable";
import { BracketView } from "./components/BracketView/BracketView";

import './App.css';

function App() {
  const [token, setToken] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'users' | 'quiniela' | 'bracket'>('quiniela');
  const [quinielaEnviada, setQuinielaEnviada] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem('team_token', tokenFromUrl);
    } else {
      const storedToken = localStorage.getItem('team_token');
      if (storedToken) setToken(storedToken);
    }
  }, []);

  if (!token) {
    return (
      <div className="token-form">
        <h1>🏆 Quiniela Mundial</h1>
        <p>Ingresa el token de tu equipo:</p>
        <input 
          type="text" 
          placeholder="Ejemplo: EQUIPO123"
          id="token-input"
        />
        <button onClick={() => {
          const input = document.getElementById('token-input') as HTMLInputElement;
          if (input.value) setToken(input.value);
        }}>
          Ingresar
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>🏆 Quiniela</h1>
        <div className="token-info">Token: {token}</div>
        <nav>
          <button onClick={() => setActiveTab('quiniela')}>📊 Quiniela Tabla</button>
          <button onClick={() => setActiveTab('bracket')}>🏆 Bracket Gráfico</button>
          <button onClick={() => setActiveTab('users')}>👥 Usuarios</button>
        </nav>
      </header>

      <main>
        {activeTab === 'users' && <UserModule token={token} />}
        {activeTab === 'quiniela' && (
          <QuinielaTable token={token} userId={currentUserId} />
        )}
        {activeTab === 'bracket' && (
          <BracketView 
            token={token} 
            userId={currentUserId} 
            quinielaEnviada={quinielaEnviada}
          />
        )}
      </main>
    </div>
  );
}

export default App;