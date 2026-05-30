// src/services/api.ts
const API_BASE_URL = 'https://hackathon-quiniela.onrender.com';

export const apiRequest = async <T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  console.log(`📡 Llamando a: ${url}`);
  console.log(`🔑 Token: ${token}`);

  const response = await fetch(url, {
    ...options,
    headers: {
      'x-team-token': token,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  console.log(`📊 Status: ${response.status}`);

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
      console.error('❌ Error response:', error);
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  console.log('✅ Respuesta:', data);
  return data;
};
