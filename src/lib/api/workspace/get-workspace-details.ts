'use client';

import { useQuery } from '@tanstack/react-query';
import type {
  ExtractFnReturnType,
  QueryConfig
} from '@/lib/api-setting/react-query';
import { authClient } from '@/lib/auth/auth-client';
import { ActiveOrganization } from '@/lib/auth/auth';
import { Organization } from 'better-auth/plugins';
import { useWorkspaceStore } from '@/store';

type ReceiveData = {
  data: ActiveOrganization | null;
  error: any;
};

type Workspace = { slug?: string | null; id?: string | null };

export const getActiveWorkspace = async (
  workspace: Workspace = { slug: null, id: null }
): Promise<ReceiveData> => {
  try {
    const queryParams: any = { membersLimit: 100 };

    if (workspace.id) {
      queryParams.organizationId = workspace.id;
    } else {
      queryParams.organizationSlug = workspace.slug;
    }

    const { data: activeWorkspaceData, error } =
      await authClient.organization.getFullOrganization({
        query: queryParams
      });

    if (error) {
      throw { data: null, error };
    }

    // data set global state
    const store = useWorkspaceStore.getState();
    store.addActiveWorkspace(activeWorkspaceData);

    return { data: activeWorkspaceData, error: null };
  } catch (error) {
    throw { data: null, error };
  }
};

type QueryFnType = typeof getActiveWorkspace;
type UseUserOptions = {
  config?: QueryConfig<QueryFnType>;
  workspace: { slug?: string | null; id?: string | null };
};

export const useWorkspaceDetails = ({
  config = {},
  workspace = { slug: null, id: null }
}: UseUserOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['workspace-details', workspace],
    queryFn: () => getActiveWorkspace(workspace),
    enabled: !!workspace.slug || !!workspace.id
  });
};
