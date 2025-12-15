import apiClient from './client';
import { ApiResponse } from '@/types/api';
import { User, UserDetail, UserFilters, KycFilters } from '@/types/user';

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

  getPendingKyc: async (filters: KycFilters) => {
    const response = await apiClient.get<
      ApiResponse<{
        users: UserDetail[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
          hasNextPage?: boolean;
          hasPrevPage?: boolean;
        };
      }>
    >('/admin/kyc/pending', {
      params: filters,
    });
    return response.data;
  },

  getAllKyc: async (filters: KycFilters) => {
    const response = await apiClient.get<
      ApiResponse<{
        users: UserDetail[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
          hasNextPage?: boolean;
          hasPrevPage?: boolean;
        };
      }>
    >('/admin/kyc/all', {
      params: filters,
    });
    return response.data;
  },

  getUserKycDetails: async (userId: string) => {
    const response = await apiClient.get<ApiResponse<UserDetail>>(`/admin/kyc/${userId}`);
    return response.data;
  },

  approveKyc: async (userId: string) => {
    const response = await apiClient.put<ApiResponse>(`/admin/kyc/${userId}/approve`);
    return response.data;
  },

  rejectKyc: async (userId: string, reason: string) => {
    const response = await apiClient.put<ApiResponse>(`/admin/kyc/${userId}/reject`, {
      reason,
    });
    return response.data;
  },

  getUserKycDocuments: async (userId: string) => {
    const response = await apiClient.get<
      ApiResponse<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        kycDocumentUrl: string;
      }>
    >(`/admin/users/${userId}/kyc-documents`);
    return response.data;
  },
};


