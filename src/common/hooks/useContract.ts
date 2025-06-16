import { useQuery } from '@tanstack/react-query';
import { contractService } from '@/src/common/services/contract.service';

const CONTRACT_QUERY_KEY = 'contracts';

export const useFetchContracts = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [CONTRACT_QUERY_KEY, params],
    queryFn: () => contractService.getAll(params).then(res => res.data),
  });
};

export const useFetchContractById = (id: string) => {
  return useQuery({
    queryKey: [CONTRACT_QUERY_KEY, id],
    queryFn: () => contractService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};
