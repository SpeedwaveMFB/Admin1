import apiClient from './client';
import { ApiResponse } from '@/types/api';

export interface TransactionFee {
  id: string;
  type: string;
  name: string;
  feeType: 'flat' | 'percentage';
  value: number;
  updatedAt: string;
}

export const feesApi = {
  getFees: async () => {
    const response = await apiClient.get<ApiResponse<TransactionFee[]>>('/admin/fees');
    return response.data;
  },

  updateFee: async (type: string, data: { feeType: 'flat' | 'percentage'; value: number }) => {
    const response = await apiClient.put<ApiResponse>(`/admin/fees/${type}`, data);
    return response.data;
  },
};
