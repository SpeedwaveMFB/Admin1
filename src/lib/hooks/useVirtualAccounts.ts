import { useQuery } from '@tanstack/react-query';
import { virtualAccountsApi, VirtualAccountsFilters } from '../api/virtualAccounts';

export function useVirtualAccounts(filters: VirtualAccountsFilters) {
    return useQuery({
        queryKey: ['virtual-accounts', filters],
        queryFn: () => virtualAccountsApi.getVirtualAccounts(filters),
    });
}
