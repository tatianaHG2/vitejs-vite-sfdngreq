export interface User {
  id: string;
  nombre: string;
  avatar_url: string;
  quiniela_enviada: boolean;
  puntaje?: number;
}

export interface CreateUserDto {
  nombre: string;
  avatar_url: string;
  token: string;
}