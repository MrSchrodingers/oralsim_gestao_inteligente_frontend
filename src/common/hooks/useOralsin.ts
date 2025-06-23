import { useQuery } from '@tanstack/react-query';
import { oralsinService } from '@/src/common/services/oralsin.service';
import { useDebounce } from './useDebounce';

const ORALSIN_CLINIC_QUERY_KEY = 'oralsinClinics';

export const useSearchOralsinClinics = (searchTerm: string) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return useQuery({
    queryKey: [ORALSIN_CLINIC_QUERY_KEY, debouncedSearchTerm],
    queryFn: () => {
      if (debouncedSearchTerm.length < 3) {
        return Promise.resolve(null);
      }
      return oralsinService.searchClinics(debouncedSearchTerm).then(res => res.data);
    },
    enabled: debouncedSearchTerm.length >= 3,
  });
};