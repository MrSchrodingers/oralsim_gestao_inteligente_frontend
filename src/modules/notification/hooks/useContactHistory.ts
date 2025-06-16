import { useQuery } from '@tanstack/react-query';
import { contactHistoryService } from '@/src/modules/notification/services/contactHistory.service';

const CONTACT_HISTORY_QUERY_KEY = 'contactHistory';

export const useFetchContactHistory = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [CONTACT_HISTORY_QUERY_KEY, params],
    queryFn: () => contactHistoryService.getAll(params).then(res => res.data),
  });
};

export const useFetchContactHistoryById = (id: string) => {
  return useQuery({
    queryKey: [CONTACT_HISTORY_QUERY_KEY, id],
    queryFn: () => contactHistoryService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};
