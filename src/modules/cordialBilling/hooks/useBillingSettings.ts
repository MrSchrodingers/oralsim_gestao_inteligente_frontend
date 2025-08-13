import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingSettingsService } from '@/src/modules/cordialBilling/services/billingSettings.service';
import type { IBillingSettings } from '@/src/modules/cordialBilling/interfaces/IBillingSettings';

const BILLING_SETTINGS_QUERY_KEY = 'billingSettings';

export const useFetchBillingSettings = (clinicId: string) => {
  return useQuery({
    queryKey: [BILLING_SETTINGS_QUERY_KEY, clinicId],
    queryFn: () => billingSettingsService.getByClinicId().then(res => res.data.results[0]),
    enabled: !!clinicId,
  });
};

export const useUpdateBillingSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data }: { clinicId: string; data: IBillingSettings }) => billingSettingsService.update(data).then(res => res.data),
    onSuccess: (data: IBillingSettings) => {
      queryClient.invalidateQueries({ queryKey: [BILLING_SETTINGS_QUERY_KEY, data.clinic_id] });
      queryClient.setQueryData([BILLING_SETTINGS_QUERY_KEY, data.clinic_id], data);
    },
  });
};
