import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactScheduleService } from '@/src/modules/notification/services/contactSchedule.service';
import type { IContactSchedule, IContactScheduleCreateDTO, IContactScheduleUpdateDTO } from '@/src/modules/notification/interfaces/IContactSchedule';

const CONTACT_SCHEDULE_QUERY_KEY = 'contactSchedules';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useUpdateContactSchedule = (paramsToInvalidate?: Record<string, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    // A função de mutação agora recebe apenas a DTO
    mutationFn: (scheduleData: { id: string; data: IContactScheduleUpdateDTO }) => 
      contactScheduleService.update(scheduleData.id, scheduleData.data).then(res => res.data),

    // `onMutate` é executado antes da mutação, ideal para a atualização otimista
    onMutate: async (updatedSchedule) => {
      // 1. Define a chave da query que queremos atualizar
      const queryKey = [CONTACT_SCHEDULE_QUERY_KEY, paramsToInvalidate];

      // 2. Cancela qualquer refetch pendente para evitar sobrescrever nossa atualização otimista
      await queryClient.cancelQueries({ queryKey });

      // 3. Pega um snapshot do estado anterior do cache
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const previousSchedules = queryClient.getQueryData<any>(queryKey);

      // 4. Atualiza o cache otimisticamente com os novos dados
      if (previousSchedules) {
        queryClient.setQueryData(queryKey, {
          ...previousSchedules,
          results: previousSchedules.results.map((schedule: IContactSchedule) =>
            schedule.id === updatedSchedule.id
              ? { ...schedule, ...updatedSchedule.data }
              : schedule
          ),
        });
      }

      // 5. Retorna o snapshot para que possamos reverter em caso de erro
      return { previousSchedules, queryKey };
    },

    // Em caso de erro, reverte o cache para o estado anterior
    onError: (err, variables, context) => {
      if (context?.previousSchedules) {
        queryClient.setQueryData(context.queryKey, context.previousSchedules);
      }
    },

    // Após o sucesso ou erro, sempre invalida a query para garantir que os dados
    // estejam sincronizados com o servidor.
    onSettled: (data, error, variables, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
    },
  });
};
