import { useQuery } from '@tanstack/react-query';
import { contractService } from '@/src/common/services/contract.service';

const CONTRACT_QUERY_KEY = 'contracts';

export interface IContractsSummary {
  total: number;
  active: number;
  finished: number;
  cancelled: number;
}

export const useFetchContracts = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [CONTRACT_QUERY_KEY, params],
    queryFn: () => contractService.getAll(params).then(res => res.data),
  });
};

export const useContractsSummary = (params?: Record<string, any>) =>
  useQuery<IContractsSummary>({
    queryKey: ['contract-summary', params],
    queryFn: () =>
      contractService.getAll(params).then(res => {
        const { total_items, summary } = res.data;
        return {
          total: total_items,
          active: summary?.active ?? 0,
          finished: summary?.finished ?? 0,
          cancelled: summary?.cancelled ?? 0,
        };
      }),
    staleTime: 10_000,
  });

export const useFetchContractById = (id: string) => {
  return useQuery({
    queryKey: [CONTRACT_QUERY_KEY, id],
    queryFn: () => contractService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};
