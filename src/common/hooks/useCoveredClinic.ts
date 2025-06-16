import { useQuery } from '@tanstack/react-query';
import { coveredClinicService } from '@/src/common/services/coveredClinic.service';

const COVERED_CLINIC_QUERY_KEY = 'coveredClinics';

export const useFetchCoveredClinics = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [COVERED_CLINIC_QUERY_KEY, params],
    queryFn: () => coveredClinicService.getAll(params).then(res => res.data),
  });
};
