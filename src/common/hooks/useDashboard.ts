import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/src/common/services/dashboard.service';

const DASHBOARD_QUERY_KEY = 'dashboard';

export const useFetchDashboardSummary = (clinicId?: string) => {
  return useQuery({
    queryKey: [DASHBOARD_QUERY_KEY, 'summary', clinicId],
    queryFn: () => dashboardService.getSummary().then(res => res.data),
  });
};
