import { getPlans } from '@/lib/api/plan/get-plan-details';
import { queryClient } from '@/lib/api-setting/react-query';
import { PlanDetails } from '@/utils/constants/pricing/pricing-plans';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Plans = {
  activePlan: (PlanDetails & { plan: string }) | null;
};

type PlansActions = {
  addActivePlan: (plan: (PlanDetails & { plan: string }) | null) => void;
  refreshPlans: (workspaceId: string | null) => Promise<void>;
};

export const usePlansStore = create<Plans & PlansActions>()(
  persist(
    (set) => ({
      activePlan: null,
      addActivePlan: (plan) => set({ activePlan: plan }),
      refreshPlans: async (workspaceId: string | null) => {
        try {
          // 1. Invalidate the old cache data
          await queryClient.invalidateQueries({
            queryKey: ['plans-details', workspaceId],
            exact: false
          });

          // 2. Fetch fresh data & update TanStack Query cache
          const { activePlan, error } = await queryClient.fetchQuery({
            queryKey: ['plans-details', workspaceId],
            queryFn: () => getPlans(workspaceId)
          });

          if (error) throw error;

          // 3. Update Zustand state
          set({ activePlan });
        } catch (error) {
          throw error;
        }
      }
    }),
    { name: 'plans-store', skipHydration: true }
  )
);
