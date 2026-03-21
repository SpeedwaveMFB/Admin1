import apiClient from './client';
import { ApiResponse } from '@/types/api';
import {
  Transaction,
  TransactionFilters,
  TransactionStats,
  BillTransaction,
  BillFilters,
  BillStats,
} from '@/types/transaction';

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
    const payload: any = response.data;
    const normalizedData =
      payload?.data?.transaction ??
      payload?.data?.transactions?.[0] ??
      payload?.data;

    return {
      ...payload,
      data: normalizedData,
    };
  },

  getTransactionStats: async () => {
    const response = await apiClient.get<ApiResponse<TransactionStats>>(
      '/admin/transactions/stats'
    );
    return response.data;
  },

  getAirtimeBills: async (filters: BillFilters) => {
    const response = await apiClient.get<
      ApiResponse<{
        transactions: BillTransaction[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
          hasNextPage?: boolean;
          hasPrevPage?: boolean;
        };
      }>
    >('/admin/bills/airtime', {
      params: filters,
    });
    return response.data;
  },

  getDataBills: async (filters: BillFilters) => {
    const response = await apiClient.get<
      ApiResponse<{
        transactions: BillTransaction[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
          hasNextPage?: boolean;
          hasPrevPage?: boolean;
        };
      }>
    >('/admin/bills/data', {
      params: filters,
    });
    return response.data;
  },

  getElectricityBills: async (filters: BillFilters) => {
    const response = await apiClient.get<
      ApiResponse<{
        transactions: BillTransaction[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
          hasNextPage?: boolean;
          hasPrevPage?: boolean;
        };
      }>
    >('/admin/bills/electricity', {
      params: filters,
    });
    return response.data;
  },

  getCableBills: async (filters: BillFilters) => {
    const response = await apiClient.get<
      ApiResponse<{
        transactions: BillTransaction[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          hasNextPage?: boolean;
          hasPrevPage?: boolean;
        };
      }>
    >('/admin/bills/cable', {
      params: filters,
    });
    return response.data;
  },

  getBillStats: async (filters?: { startDate?: string; endDate?: string }) => {
    const response = await apiClient.get<ApiResponse<BillStats>>('/admin/bills/stats', {
      params: filters,
    });
    return response.data;
  },
};


