// Configuración de la API
const API_BASE_URL = 'https://hackathon-quiniela.onrender.com';

// Función para obtener headers con el token
export const getHeaders = (token: string) => ({
  'x-team-token': token,
  'Content-Type': 'application/json',
});

// Función genérica para peticiones
export const apiRequest = async <T>(
  endpoint: string,
  token: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(token),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Error ${response.status}`);
  }

  return response.json();
};