import { useQuery } from '@tanstack/react-query';
import { installmentService } from '@/src/common/services/installment.service';

const INSTALLMENT_QUERY_KEY = 'installments';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFetchInstallments = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [INSTALLMENT_QUERY_KEY, params],
    queryFn: () => installmentService.getAll(params).then(res => res.data),
    enabled: !!params, 
  });
};

export const useFetchInstallmentById = (id: string) => {
  return useQuery({
    queryKey: [INSTALLMENT_QUERY_KEY, id],
    queryFn: () => installmentService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};
