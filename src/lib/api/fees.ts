import apiClient from './client';
import { ApiResponse } from '@/types/api';

export interface TransactionFee {
  id?: string;
  type: string; // transaction type key used in PUT /admin/fees/:type
  name?: string;
  feeType: 'flat' | 'percentage';
  feeValue: number;
  updatedAt?: string;

  // Backend may also return these (snake_case / legacy)
  value?: number;
  fee_value?: number;
  minAmount?: number;
  maxAmount?: number;
  isActive?: boolean;
}

export const feesApi = {
  getFees: async () => {
    const response = await apiClient.get<ApiResponse<TransactionFee[]>>('/admin/fees');
    return response.data;
  },

  updateFee: async (
    type: string,
    data: { feeType: 'flat' | 'percentage'; feeValue: number }
  ) => {
    // Send multiple naming styles for compatibility
    const payload = {
      feeType: data.feeType,
      feeValue: data.feeValue,
      fee_value: data.feeValue,
      value: data.feeValue,
    };

    const response = await apiClient.put<ApiResponse>(`/admin/fees/${type}`, payload);
    return response.data;
  },
};
