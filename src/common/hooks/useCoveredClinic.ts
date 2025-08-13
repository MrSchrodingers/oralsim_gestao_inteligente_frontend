import { useQuery } from '@tanstack/react-query';
import { coveredClinicService } from '@/src/common/services/coveredClinic.service';

const COVERED_CLINIC_QUERY_KEY = 'coveredClinics';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFetchCoveredClinics = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [COVERED_CLINIC_QUERY_KEY, params],
    queryFn: () => coveredClinicService.getAll(params).then(res => res.data),
  });
};
