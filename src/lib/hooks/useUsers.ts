import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import { UserFilters, KycFilters } from '@/types/user';

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersApi.getUsers(filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      usersApi.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function usePendingKyc(filters: KycFilters) {
  return useQuery({
    queryKey: ['kyc-pending', filters],
    queryFn: () => usersApi.getPendingKyc(filters),
  });
}

export function useAllKyc(filters: KycFilters) {
  return useQuery({
    queryKey: ['kyc-all', filters],
    queryFn: () => usersApi.getAllKyc(filters),
  });
}

export function useUserKyc(userId: string) {
  return useQuery({
    queryKey: ['kyc-user', userId],
    queryFn: () => usersApi.getUserKycDetails(userId),
    enabled: !!userId,
  });
}

export function useApproveKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => usersApi.approveKyc(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-pending'] });
      queryClient.invalidateQueries({ queryKey: ['kyc-all'] });
      queryClient.invalidateQueries({ queryKey: ['kyc-user'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useRejectKyc() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      usersApi.rejectKyc(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kyc-pending'] });
      queryClient.invalidateQueries({ queryKey: ['kyc-all'] });
      queryClient.invalidateQueries({ queryKey: ['kyc-user'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      usersApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

export function useTogglePnd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.togglePnd(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

export function useToggleNoCredit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersApi.toggleNoCredit(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

export function useManualAdjust() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { type: 'credit' | 'debit'; amount: number; reason: string } }) =>
      usersApi.manualAdjust(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
}


