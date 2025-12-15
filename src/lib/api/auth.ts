import apiClient from './client';
import { ApiResponse } from '@/types/api';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  admin: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    permissions?: string[];
  };
}

export const authApi = {
  login: async (data: LoginData) => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/admin/login',
      data
    );
    return response.data;
  },
};


