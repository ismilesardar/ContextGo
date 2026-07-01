'use client';

import { Spinner } from '@/components/ui/spinner';
import { NameForm } from './general-section/name-form';
import { useUserSession } from '@/hooks/use-client-session';
import { EmailSection } from './general-section/email-section';
import { AvatarForm } from './general-section/avatar-form';
import { WorkspaceForm } from './general-section/workspace-form';
import { AccountDeleteSection } from './general-section/account-delete-section';

export function ProfileViewPage() {
  const { user, isLoading, refreshSession } = useUserSession();

  return (
    <>
      {!isLoading && user ? (
        <div className='flex w-full flex-col gap-y-10 pb-10'>
          <NameForm user={user} refreshSession={refreshSession} />
          <EmailSection user={user} />
          <AvatarForm user={user} refreshSession={refreshSession} />
          <WorkspaceForm user={user} />
          <AccountDeleteSection />
        </div>
      ) : (
        <div className='flex size-full items-center justify-center'>
          <Spinner />
        </div>
      )}
    </>
  );
}
