import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pendingSyncService } from '@/src/common/services/pendingSync.service';
import type { IPendingSync } from '@/src/common/interfaces/IPendingSync';

const PENDING_SYNC_QUERY_KEY = 'pendingSyncs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFetchPendingSyncs = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [PENDING_SYNC_QUERY_KEY, params],
    queryFn: () => pendingSyncService.getAll(params).then(res => res.data),
  });
};

export const useApprovePendingSync = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => pendingSyncService.approve(id).then(res => res.data),
    onSuccess: (data: IPendingSync) => {
      queryClient.invalidateQueries({ queryKey: [PENDING_SYNC_QUERY_KEY] });
      queryClient.setQueryData([PENDING_SYNC_QUERY_KEY, data.id], data);
    },
  });
};
