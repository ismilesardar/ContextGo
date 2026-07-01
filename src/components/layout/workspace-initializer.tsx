'use client';

import React from 'react';
import Cookies from 'js-cookie';
import { useWorkspaceStore } from '@/store';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { setActiveWorkspaceName } from '@/utils/save-local';
import { queryClient } from '@/lib/api-setting/react-query';
import { getActiveWorkspace } from '@/lib/api/workspace/get-workspace-details';
import { useUserSession } from '@/hooks/use-client-session';

export function WorkspaceInitializer() {
  const params = useParams();
  const { user } = useUserSession();
  const { activeWorkspace, addWorkspaces, addActiveMember } =
    useWorkspaceStore();

  // Standardize the slug from params
  const paramsSlug = Array.isArray(params.workspace)
    ? params.workspace[0]
    : params.workspace;

  React.useEffect(() => {
    // Only run if we have a user and no active workspace set in store
    if (user && !activeWorkspace && paramsSlug) {
      handleInitialSetup();
    }
  }, [user, activeWorkspace, paramsSlug]);

  async function handleInitialSetup() {
    try {
      // 1. Get the list of workspaces user actually belongs to
      const { data: workspaces, error: listError } =
        await authClient.organization.list();

      if (listError || !workspaces || workspaces.length === 0) {
        window.location.replace('/onboarding/workspace');
        return;
      }

      // 2. Validate: Is the slug in the URL one of their workspaces?
      const matchedWorkspace = workspaces.find((w) => w.slug === paramsSlug);

      if (!matchedWorkspace) {
        toast.error('Access denied! Redirecting to default...');
        const fallback = user?.defaultWorkspace || workspaces[0].slug;
        window.location.replace(`/${fallback}/overview`);
        return;
      }

      // 3. Update Store
      addWorkspaces(workspaces);

      // 4. Sync Active Organization with Better Auth
      // Only call setActive if it's different from the current session active org
      await authClient.organization.setActive({
        organizationId: matchedWorkspace.id
      });

      // 5. Fetch Full Details (Prefetch for the rest of the app)
      const { data: fullData } = await queryClient.fetchQuery({
        queryKey: ['workspace-details', matchedWorkspace.slug],
        queryFn: () => getActiveWorkspace({ slug: matchedWorkspace.slug }),
        staleTime: 1000 * 60 * 5 // 5 minutes
      });

      if (fullData) {
        setActiveWorkspaceName(matchedWorkspace.slug);

        // 6. Get Member Details
        const { data: member } =
          await authClient.organization.getActiveMember();
        addActiveMember(member || null);

        if (member) {
          Cookies.set('active_member', JSON.stringify(member), {
            expires: 7,
            path: '/'
          });
        }
      }
    } catch (err: any) {
      console.error('Initialization Error:', err);
      // Don't toast on every loop, just log
    }
  }

  return null;
}
