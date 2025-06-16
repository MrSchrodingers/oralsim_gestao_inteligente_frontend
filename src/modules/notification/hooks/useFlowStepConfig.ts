import { useQuery } from '@tanstack/react-query';
import { flowStepConfigService } from '@/src/modules/notification/services/flowStepConfig.service';

const FLOW_STEP_CONFIG_QUERY_KEY = 'flowStepConfigs';

export const useFetchFlowStepConfigs = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: [FLOW_STEP_CONFIG_QUERY_KEY, params],
    queryFn: () => flowStepConfigService.getAll(params).then(res => res.data),
  });
};
