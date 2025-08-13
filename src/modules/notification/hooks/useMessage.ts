import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/src/modules/notification/services/message.service';
import type { IMessage, IMessageCreateDTO, IMessageUpdateDTO } from '@/src/modules/notification/interfaces/IMessage';

const MESSAGE_QUERY_KEY = 'messages';
export interface IMessageSummary {
  total: number;
  whatsapp: number;
  sms: number;
  email: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const useFetchMessages = (params?: Record<string, any>, _p0?: { enabled: boolean; }) => {
  return useQuery({
    queryKey: [MESSAGE_QUERY_KEY, params],
    queryFn: () => messageService.getAll(params).then(res => res.data),
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useMessagesSummary = (params?: Record<string, any>) => {
  return useQuery<IMessageSummary>({
    queryKey: ["message-summary", params],
    queryFn: () =>
      messageService
        .getAll(params)
        .then(res => {
          const { total_items, summary } = res.data;
          return {
            total: total_items,
            whatsapp: summary?.whatsapp ?? 0,
            sms: summary?.sms ?? 0,
            email: summary?.email ?? 0,
          };
        }),
    staleTime: 10_000,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IMessageCreateDTO) => messageService.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MESSAGE_QUERY_KEY] });
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IMessageUpdateDTO }) => messageService.update(id, data).then(res => res.data),
    onSuccess: (data: IMessage) => {
      queryClient.invalidateQueries({ queryKey: [MESSAGE_QUERY_KEY] });
      queryClient.setQueryData([MESSAGE_QUERY_KEY, data.id], data);
    },
  });
};
