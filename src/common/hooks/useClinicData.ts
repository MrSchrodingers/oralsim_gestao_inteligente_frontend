import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clinicDataService } from '@/src/common/services/clinicData.service';
import type { IClinicData, IClinicDataCreateDTO, IClinicDataUpdateDTO } from '@/src/common/interfaces/IClinicData';

const CLINIC_DATA_QUERY_KEY = 'clinicData';

export const useFetchClinicData = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [CLINIC_DATA_QUERY_KEY, params],
    queryFn: () => clinicDataService.getAll(params).then(res => res.data),
  });
};

export const useFetchClinicDataById = (id: string) => {
  return useQuery({
    queryKey: [CLINIC_DATA_QUERY_KEY, id],
    queryFn: () => clinicDataService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useCreateClinicData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IClinicDataCreateDTO) => clinicDataService.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CLINIC_DATA_QUERY_KEY] });
    },
  });
};

export const useUpdateClinicData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IClinicDataUpdateDTO }) => clinicDataService.update(id, data).then(res => res.data),
    onSuccess: (data: IClinicData) => {
      queryClient.invalidateQueries({ queryKey: [CLINIC_DATA_QUERY_KEY] });
      queryClient.setQueryData([CLINIC_DATA_QUERY_KEY, data.id], data);
    },
  });
};
