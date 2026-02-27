import apiClient from './client';
import { ApiResponse } from '@/types/api';

export interface VirtualAccount {
    id: string;
    userId: string;
    accountNumber: string;
    accountName: string;
    bankName: string;
    status: string;
    createdAt: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
}

export interface VirtualAccountsFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}

interface VirtualAccountsResponse {
    accounts: VirtualAccount[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
    };
}

export const virtualAccountsApi = {
    getVirtualAccounts: async (filters: VirtualAccountsFilters) => {
        const response = await apiClient.get<ApiResponse<VirtualAccountsResponse>>('/admin/virtual-accounts', {
            params: filters,
        });
        return response.data;
    },
};
