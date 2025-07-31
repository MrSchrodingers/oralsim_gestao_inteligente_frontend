import { useQuery } from '@tanstack/react-query';
import { collectionCaseService } from '@/src/modules/cordialBilling/services/collectionCase.service';

const COLLECTION_CASE_QUERY_KEY = 'collectionCases';

export const useFetchCollectionCases = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [COLLECTION_CASE_QUERY_KEY, params],
    queryFn: () => collectionCaseService.getAll(params).then(res => res.data),
    enabled: !!params, 
  });
};

export const useFetchCollectionCaseById = (id: string) => {
  return useQuery({
    queryKey: [COLLECTION_CASE_QUERY_KEY, id],
    queryFn: () => collectionCaseService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};
