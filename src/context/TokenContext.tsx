import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TokenContextType {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export const useToken = (): TokenContextType => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error('useToken debe usarse dentro de TokenProvider');
  }
  return context;
};

interface TokenProviderProps {
  children: ReactNode;
}

export const TokenProvider: React.FC<TokenProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    // Obtener token de URL o localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    if (urlToken) {
      localStorage.setItem('team_token', urlToken);
      return urlToken;
    }
    return localStorage.getItem('team_token');
  });

  const setToken = (newToken: string): void => {
    localStorage.setItem('team_token', newToken);
    setTokenState(newToken);
  };

  const clearToken = (): void => {
    localStorage.removeItem('team_token');
    setTokenState(null);
  };

  return (
    <TokenContext.Provider value={{ token, setToken, clearToken }}>
      {children}
    </TokenContext.Provider>
  );
};