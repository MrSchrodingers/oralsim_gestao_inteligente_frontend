import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pendingCallService } from '@/src/modules/notification/services/pendingCall.service';
import type { IPendingCall } from '@/src/modules/notification/interfaces/IPendingCall';

const PENDING_CALL_QUERY_KEY = 'pendingCalls';
export const PENDING_CALLS_QUERY_KEY = ["pendingCalls"]
export const PENDING_CALLS_SUMMARY_QUERY_KEY = ["pendingCalls", "summary"]

export interface IPendingCallSummary {
  total: number
  high: number
  medium: number
  normal: number
  total_overdue: number
  avg_attempts: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFetchPendingCalls = (params?: Record<string, any>) =>
  useQuery({
    queryKey: [...PENDING_CALLS_QUERY_KEY, params],
    queryFn: () => pendingCallService.getAll(params).then((res) => res.data),
    refetchOnWindowFocus: true,
  })
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const usePendingCallsSummary = (params?: Record<string, any>) => {
  return useQuery<IPendingCallSummary>({
    queryKey: [...PENDING_CALLS_SUMMARY_QUERY_KEY, params],
    queryFn: () =>
      pendingCallService.getAll(params).then(res => {
        const { total_items, summary } = res.data
        return {
          total: total_items,
          high: summary?.high ?? 0,
          medium: summary?.medium ?? 0,
          normal: summary?.normal ?? 0,
          total_overdue: Number(summary?.total_overdue ?? 0),
          avg_attempts: Number(summary?.avg_attempts ?? 0),
        }
      }),
    staleTime: 10_000,
  })
}

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

export const useMarkPendingCallDone = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, success, notes }: { id: string; success: boolean; notes: string }) =>
      pendingCallService.markDone(id, success, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [...PENDING_CALLS_QUERY_KEY]})
      queryClient.invalidateQueries({queryKey: [...PENDING_CALLS_SUMMARY_QUERY_KEY]})
    },
  })
}