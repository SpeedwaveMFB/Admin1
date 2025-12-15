import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions';
import { TransactionFilters, BillFilters } from '@/types/transaction';

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.getTransactions(filters),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionsApi.getTransactionById(id),
    enabled: !!id,
  });
}

export function useTransactionStats() {
  return useQuery({
    queryKey: ['transaction-stats'],
    queryFn: () => transactionsApi.getTransactionStats(),
  });
}

export function useAirtimeBills(filters: BillFilters) {
  return useQuery({
    queryKey: ['bills-airtime', filters],
    queryFn: () => transactionsApi.getAirtimeBills(filters),
  });
}

export function useDataBills(filters: BillFilters) {
  return useQuery({
    queryKey: ['bills-data', filters],
    queryFn: () => transactionsApi.getDataBills(filters),
  });
}

export function useElectricityBills(filters: BillFilters) {
  return useQuery({
    queryKey: ['bills-electricity', filters],
    queryFn: () => transactionsApi.getElectricityBills(filters),
  });
}

export function useCableBills(filters: BillFilters) {
  return useQuery({
    queryKey: ['bills-cable', filters],
    queryFn: () => transactionsApi.getCableBills(filters),
  });
}

export function useBillStats(filters?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['bills-stats', filters],
    queryFn: () => transactionsApi.getBillStats(filters),
  });
}


