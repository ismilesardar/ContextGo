import { getActiveWorkspace } from '@/lib/api/workspace/get-workspace-details';
import { queryClient } from '@/lib/api-setting/react-query';
import { ActiveOrganization, ActiveOrganizationMember } from '@/lib/auth/auth';
import { Organization } from 'better-auth/plugins';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Workspace = {
  activeWorkspace: ActiveOrganization | null;
  workspaces: Organization[];
  activeMember: ActiveOrganizationMember | null;
  isSwitchingWorkspace: boolean;
  // hasImageToken: boolean;
  // hasSystemToken: boolean;
};

type ActiveWorkspace = { slug?: string | null; id?: string | null };

type Actions = {
  addActiveWorkspace: (workspace: ActiveOrganization) => void;
  addWorkspaces: (workspaces: Organization[]) => void;
  refreshActiveWorkspace: (workspace: ActiveWorkspace) => Promise<void>;
  addActiveMember: (member: ActiveOrganizationMember | null) => void;
  setSwitchingWorkspace: (switching: boolean) => void;
};

export const useWorkspaceStore = create<Workspace & Actions>()(
  persist(
    (set) => ({
      activeWorkspace: null,
      activeMember: null,
      workspaces: [],
      isSwitchingWorkspace: false,
      // hasImageToken: activeWorkspace?.imageTokenLimit && activeWorkspace.imageTokens > 0,
      // hasSystemToken: activeWorkspace?.systemTokenLimit && activeWorkspace.systemTokens > 0,
      addActiveMember: (member) => set({ activeMember: member }),
      addActiveWorkspace: (workspace: ActiveOrganization) =>
        set({
          activeWorkspace: workspace
        }),
      addWorkspaces: (workspaces: Organization[]) =>
        set({
          workspaces: workspaces
        }),
      setSwitchingWorkspace: (switching) =>
        set({ isSwitchingWorkspace: switching }),
      refreshActiveWorkspace: async (workspace) => {
        try {
          // 1. Invalidate the old cache data
          await queryClient.invalidateQueries({
            queryKey: ['workspace-details', workspace],
            exact: false
          });

          // 2. Fetch fresh data & update TanStack Query cache
          const { data, error } = await queryClient.fetchQuery({
            queryKey: ['workspace-details', workspace],
            queryFn: () =>
              getActiveWorkspace({ slug: workspace.slug, id: workspace.id })
          });

          if (error) throw error;

          // 3. Update Zustand state
          set({ activeWorkspace: data });
        } catch (error) {
          throw error;
        }
      }
    }),
    {
      name: 'workspace-store',
      skipHydration: true,
      partialize: (state) => ({
        activeWorkspace: state.activeWorkspace,
        activeMember: state.activeMember,
        workspaces: state.workspaces
        // isSwitchingWorkspace intentionally excluded from persistence
      })
    }
  )
);
