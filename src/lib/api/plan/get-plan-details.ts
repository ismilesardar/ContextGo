'use client';

import { useQuery } from '@tanstack/react-query';
import type {
  ExtractFnReturnType,
  QueryConfig
} from '@/lib/api-setting/react-query';
import { PlanDetails, PLANS } from '@/utils/constants/pricing/pricing-plans';
import { usePlansStore } from '@/store/workspace-store/plan-store';

type ReceiveData = {
  activePlan: (PlanDetails & { plan: string }) | null;
  error: any;
};

export const getPlans = async (
  workspaceId: string | null = null
): Promise<ReceiveData> => {
  try {
    if (!workspaceId) {
      throw { activePlan: null, error: 'Workspace ID is required' };
    }

    // Fetch the workspace's plan from the server (updated by Creem webhook onGrantAccess)
    const res = await fetch(`/api/workspace/plan?workspaceId=${workspaceId}`);
    if (!res.ok) throw new Error('Failed to fetch workspace plan');
    const workspaceData = await res.json();

    const planName = workspaceData?.plan || 'Free';

    const planTemplate = PLANS.find(
      (plan) => plan.name.toLowerCase() === planName.toLowerCase()
    );

    const activePlan: (PlanDetails & { plan: string }) | null = planTemplate
      ? {
          ...planTemplate,
          plan: planName
        }
      : null;

    // Update global state
    const store = usePlansStore.getState();
    store.addActivePlan(activePlan);

    return {
      activePlan,
      error: null
    };
  } catch (error) {
    throw { activePlan: null, error };
  }
};

type QueryFnType = typeof getPlans;
type UsePlanOptions = {
  config?: QueryConfig<QueryFnType>;
  workspaceId: string | null;
};

export const usePlansDetails = ({
  config = {},
  workspaceId = null
}: UsePlanOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['plans-details', workspaceId],
    queryFn: () => getPlans(workspaceId),
    enabled: !!workspaceId
  });
};
