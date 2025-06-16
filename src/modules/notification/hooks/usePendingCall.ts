import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pendingCallService } from '@/src/modules/notification/services/pendingCall.service';
import type { IPendingCall } from '@/src/modules/notification/interfaces/IPendingCall';

const PENDING_CALL_QUERY_KEY = 'pendingCalls';

export const useFetchPendingCalls = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [PENDING_CALL_QUERY_KEY, params],
    queryFn: () => pendingCallService.getAll(params).then(res => res.data),
  });
};

export const useUpdatePendingCall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IPendingCall> }) => pendingCallService.update(id, data).then(res => res.data),
    onSuccess: (data: IPendingCall) => {
      queryClient.invalidateQueries({ queryKey: [PENDING_CALL_QUERY_KEY] });
      queryClient.setQueryData([PENDING_CALL_QUERY_KEY, data.id], data);
    },
  });
};
