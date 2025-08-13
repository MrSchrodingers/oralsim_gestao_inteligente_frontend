import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientPhoneService } from '@/src/common/services/patientPhone.service';
import type { IPatientPhone, IPatientPhoneCreateDTO, IPatientPhoneUpdateDTO } from '@/src/common/interfaces/IPatientPhone';

const PATIENT_PHONE_QUERY_KEY = 'patientPhones';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFetchPatientPhones = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [PATIENT_PHONE_QUERY_KEY, params],
    queryFn: () => patientPhoneService.getAll(params).then(res => res.data),
  });
};

export const useCreatePatientPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPatientPhoneCreateDTO) => patientPhoneService.create(data).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [PATIENT_PHONE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['patients', data.patient_id] });
    },
  });
};

export const useUpdatePatientPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IPatientPhoneUpdateDTO }) => patientPhoneService.update(id, data).then(res => res.data),
    onSuccess: (data: IPatientPhone) => {
      queryClient.invalidateQueries({ queryKey: [PATIENT_PHONE_QUERY_KEY] });
      queryClient.setQueryData([PATIENT_PHONE_QUERY_KEY, data.id], data);
      queryClient.invalidateQueries({ queryKey: ['patients', data.patient_id] });
    },
  });
};

export const useDeletePatientPhone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patientPhoneService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PATIENT_PHONE_QUERY_KEY] });
    },
  });
};
