import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '@/src/common/services/patient.service';
import type { IPatient, IPatientUpdateDTO } from '@/src/common/interfaces/IPatient';
import type { IPatientRegisterRequest } from '../interfaces/IPatientRegisterRequest';

const PATIENT_QUERY_KEY = 'patients';

export const useFetchPatients = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [PATIENT_QUERY_KEY, params],
    queryFn: () => patientService.getAll(params).then(res => res.data),
  });
};

export const useFetchPatientById = (id: string) => {
  return useQuery({
    queryKey: [PATIENT_QUERY_KEY, id],
    queryFn: () => patientService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IPatientUpdateDTO }) => patientService.update(id, data).then(res => res.data),
    onSuccess: (data: IPatient) => {
      queryClient.invalidateQueries({ queryKey: [PATIENT_QUERY_KEY] });
      queryClient.setQueryData([PATIENT_QUERY_KEY, data.id], data);
    },
  });
};

export const useRegisterPatients = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IPatientRegisterRequest) => patientService.register(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PATIENT_QUERY_KEY]});
        },
    });
};
