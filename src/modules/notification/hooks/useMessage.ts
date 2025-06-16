import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messageService } from '@/src/modules/notification/services/message.service';
import type { IMessage, IMessageCreateDTO, IMessageUpdateDTO } from '@/src/modules/notification/interfaces/IMessage';

const MESSAGE_QUERY_KEY = 'messages';

export const useFetchMessages = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [MESSAGE_QUERY_KEY, params],
    queryFn: () => messageService.getAll(params).then(res => res.data),
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
