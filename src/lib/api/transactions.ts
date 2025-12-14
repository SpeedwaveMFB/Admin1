import apiClient from './client';
import { ApiResponse } from '@/types/api';
import { Transaction, TransactionFilters, TransactionStats } from '@/types/transaction';

interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
}

export const transactionsApi = {
  getTransactions: async (filters: TransactionFilters) => {
    const response = await apiClient.get<ApiResponse<TransactionsResponse>>(
      '/admin/transactions',
      {
        params: filters,
      }
    );
    return response.data;
  },

  getTransactionById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Transaction>>(
      `/admin/transactions/${id}`
    );
    return response.data;
  },

  getTransactionStats: async () => {
    const response = await apiClient.get<ApiResponse<TransactionStats>>(
      '/admin/transactions/stats'
    );
    return response.data;
  },
};

