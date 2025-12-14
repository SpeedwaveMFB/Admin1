import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions';
import { TransactionFilters } from '@/types/transaction';

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

