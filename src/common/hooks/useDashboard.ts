import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/src/common/services/dashboard.service';

const DASHBOARD_QUERY_KEY = 'dashboard';

export const useFetchDashboardSummary = (
  clinicId?: string,
  periodDays?: number
) =>
  useQuery({
    queryKey: ['dashboard', clinicId, periodDays ?? 'all'],
    queryFn: () =>
      dashboardService.getSummary(
        periodDays ? { period_days: periodDays } : undefined
      ).then((r) => r.data),
    enabled: !!clinicId,
    staleTime: 60_000,
  })