import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicPhoneService } from '@/src/common/services/clinicPhone.service';
import type { IClinicPhone, IClinicPhoneCreateDTO, IClinicPhoneUpdateDTO } from '@/src/common/interfaces/IClinicPhone';

const CLINIC_PHONE_QUERY_KEY = 'clinicPhones';

export const useFetchClinicPhones = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [CLINIC_PHONE_QUERY_KEY, params],
    queryFn: () => clinicPhoneService.getAll(params).then(res => res.data),
  });
};

export const useCreateClinicPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IClinicPhoneCreateDTO) => clinicPhoneService.create(data).then(res => res.data),
    onSuccess: (data: IClinicPhone) => {
      queryClient.invalidateQueries({ queryKey: [CLINIC_PHONE_QUERY_KEY] });
      queryClient.setQueryData([CLINIC_PHONE_QUERY_KEY, data.id], data);
    },
  });
};

export const useUpdateClinicPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IClinicPhoneUpdateDTO }) => clinicPhoneService.update(id, data).then(res => res.data),
    onSuccess: (data: IClinicPhone) => {
      queryClient.invalidateQueries({ queryKey: [CLINIC_PHONE_QUERY_KEY] });
      queryClient.setQueryData([CLINIC_PHONE_QUERY_KEY, data.id], data);
    },
  });
};

export const useDeleteClinicPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clinicPhoneService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLINIC_PHONE_QUERY_KEY] });
    },
  });
};