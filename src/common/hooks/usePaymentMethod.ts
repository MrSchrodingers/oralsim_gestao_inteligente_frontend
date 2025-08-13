import { useQuery } from '@tanstack/react-query';
import { paymentMethodService } from '@/src/common/services/paymentMethod.service';

const PAYMENT_METHOD_QUERY_KEY = 'paymentMethods';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useFetchPaymentMethods = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [PAYMENT_METHOD_QUERY_KEY, params],
    queryFn: () => paymentMethodService.getAll(params).then(res => res.data),
  });
};
