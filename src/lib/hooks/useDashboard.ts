import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    refetchInterval: 60000, // Refetch every minute
  });
}

export function useHealthStatus() {
  return useQuery({
    queryKey: ['health-status'],
    queryFn: () => dashboardApi.getHealth(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useNombaBalance() {
  return useQuery({
    queryKey: ['nomba-balance'],
    queryFn: () => dashboardApi.getNombaBalance(),
    refetchInterval: 60000, // Refetch every minute
  });
}

