'use client';

import { Spinner } from '@/components/ui/spinner';
import { useUserSession } from '@/hooks/use-client-session';
import { WorkspaceNameForm } from './general-section/workspace-name-form';
import { WorkspaceSlugForm } from './general-section/workspace-slug-form';
import { WorkspaceAvatarForm } from './general-section/workspace-avatar-form';
import { useWorkspaceStore } from '@/store';
import { WorkspaceDeleteSection } from './general-section/workspace-delete-section';

export function WorkspaceSettingPage() {
  const { user, isLoading } = useUserSession();
  const { activeWorkspace } = useWorkspaceStore((state) => state);

  return (
    <>
      {!isLoading && user ? (
        <div className='flex w-full flex-col gap-y-10 pb-10'>
          <WorkspaceNameForm />
          <WorkspaceSlugForm />
          <WorkspaceAvatarForm />
          {activeWorkspace && (
            <WorkspaceDeleteSection workspace={activeWorkspace} />
          )}
        </div>
      ) : (
        <div className='flex size-full items-center justify-center'>
          <Spinner />
        </div>
      )}
    </>
  );
}
