import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactScheduleService } from '@/src/modules/notification/services/contactSchedule.service';
import type { IContactSchedule, IContactScheduleCreateDTO, IContactScheduleUpdateDTO } from '@/src/modules/notification/interfaces/IContactSchedule';

const CONTACT_SCHEDULE_QUERY_KEY = 'contactSchedules';

export const useFetchContactSchedules = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [CONTACT_SCHEDULE_QUERY_KEY, params],
    queryFn: () => contactScheduleService.getAll(params).then(res => res.data),
  });
};

export const useCreateContactSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IContactScheduleCreateDTO) => contactScheduleService.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTACT_SCHEDULE_QUERY_KEY] });
    },
  });
};

export const useUpdateContactSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IContactScheduleUpdateDTO }) => contactScheduleService.update(id, data).then(res => res.data),
    onSuccess: (data: IContactSchedule) => {
      queryClient.invalidateQueries({ queryKey: [CONTACT_SCHEDULE_QUERY_KEY] });
      queryClient.setQueryData([CONTACT_SCHEDULE_QUERY_KEY, data.id], data);
    },
  });
};
