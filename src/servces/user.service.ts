import { apiClient } from './api.config';
import { User, CreateUserDto } from '../types/user.types';
import { ApiResponse } from '../types/api.types';

export const userService = {
  async create(userData: CreateUserDto): Promise<User> {
    const response = await apiClient.post<ApiResponse<User>>(
      '/users',
      userData
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al crear usuario');
    }
    return response.data.data;
  },

  async getByToken(token: string): Promise<User[]> {
    const response = await apiClient.get<ApiResponse<User[]>>('/users', {
      params: { token },
    });
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Error al obtener usuarios');
    }
    return response.data.data;
  },

  async getQuinielaStatus(userId: string, token: string): Promise<boolean> {
    const response = await apiClient.get<ApiResponse<{ enviada: boolean }>>(
      `/users/${userId}/quiniela-status`,
      { params: { token } }
    );
    return response.data.data?.enviada || false;
  },
};
