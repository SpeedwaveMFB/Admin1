import apiClient from './client';
import { ApiResponse } from '@/types/api';
import { User, UserDetail, UserFilters } from '@/types/user';

interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export const usersApi = {
  getUsers: async (filters: UserFilters) => {
    const response = await apiClient.get<ApiResponse<UsersResponse>>('/admin/users', {
      params: filters,
    });
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<UserDetail>>(`/admin/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id: string, status: string) => {
    const response = await apiClient.put<ApiResponse>(`/admin/users/${id}/status`, {
      status,
    });
    return response.data;
  },
};

