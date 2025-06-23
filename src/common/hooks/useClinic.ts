import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { IClinic, IClinicCreateDTO, IClinicUpdateDTO } from '@/src/common/interfaces/IClinic';
import { clinicService } from '../services/clinic.service';

const CLINIC_QUERY_KEY = 'clinics';
const CLINIC_SUMMARY_QUERY_KEY = 'clinics-summary';

export const useFetchClinics = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [CLINIC_QUERY_KEY, params],
    queryFn: () => clinicService.getAll(params).then(res => res.data),
  });
};

export const useFetchClinicsSummary = (id: string) => {
  return useQuery({
    queryKey: [CLINIC_SUMMARY_QUERY_KEY, id],
    queryFn: () => clinicService.getSummary(id).then(res => res.data),
  });
};

export const useFetchClinicById = (id: string) => {
  return useQuery({
    queryKey: [CLINIC_QUERY_KEY, id],
    queryFn: () => clinicService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IClinicCreateDTO) => clinicService.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLINIC_QUERY_KEY] });
    },
  });
};

export const useUpdateClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IClinicUpdateDTO }) => clinicService.update(id, data).then(res => res.data),
    onSuccess: (data: IClinic) => {
      queryClient.invalidateQueries({ queryKey: [CLINIC_QUERY_KEY] });
      queryClient.setQueryData([CLINIC_QUERY_KEY, data.id], data);
    },
  });
};

export const useDeleteClinic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clinicService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLINIC_QUERY_KEY] });
    },
  });
};
