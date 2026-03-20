import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { feesApi } from '../api/fees';

export function useFees() {
  return useQuery({
    queryKey: ['fees'],
    queryFn: () => feesApi.getFees(),
  });
}

export function useUpdateFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ type, data }: { type: string; data: { feeType: 'flat' | 'percentage'; feeValue: number } }) =>
      feesApi.updateFee(type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
}
