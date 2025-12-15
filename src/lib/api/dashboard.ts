import apiClient from './client';
import { ApiResponse } from '@/types/api';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    suspended: number;
    verified: number;
  };
  transactions: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
  };
  financials: {
    totalDeposits: number;
    totalWithdrawals: number;
    totalTransfers: number;
  };
}

interface HealthStatus {
  status: string;
  uptime: number;
  timestamp: string;
}

interface NombaBalance {
  balance: number;
  currency: string;
}

export const dashboardApi = {
  getStats: async () => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(
      '/admin/dashboard/stats'
    );
    return response.data;
  },

  getHealth: async () => {
    const response = await apiClient.get<ApiResponse<HealthStatus>>('/health');
    return response.data;
  },

  getNombaBalance: async () => {
    const response = await apiClient.get<ApiResponse<NombaBalance>>(
      '/admin/nomba/balance'
    );
    return response.data;
  },
};


