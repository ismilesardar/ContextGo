'use client';

import { Session } from 'better-auth/types';
import { SessionCard } from './session-card';
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { authClient } from '@/lib/auth/auth-client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const OtherSession = ({
  currentSessionToken,
  listOfSessions
}: {
  currentSessionToken: string;
  listOfSessions: Session[];
}) => {
  const router = useRouter();
  const otherSessions = listOfSessions.filter(
    (session) => session.token !== currentSessionToken
  );
  const handelRevokeAllSession = async () => {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        router.refresh();
      },
      onError: (error) => {
        router.refresh();
        toast.error(
          error.error?.message ||
            'Failed to revoke other sessions. Please try again later.'
        );
      }
    });
  };
  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Other Sessions</h1>
        {otherSessions.length > 0 && (
          <BetterAuthActionButton
            variant='destructive'
            size='lg'
            action={handelRevokeAllSession}
            className='cursor-pointer'
            successMessage='Other sessions revoked successfully'
          >
            Revoke Other Sessions
          </BetterAuthActionButton>
        )}
      </div>
      {otherSessions.length === 0 ? (
        <div className='flex items-center justify-center'>
          <p className='text-sm text-neutral-500'>
            No other active sessions found.
          </p>
        </div>
      ) : (
        otherSessions.map((session) => (
          <SessionCard
            key={session.token}
            session={session}
            isCurrentSession={false}
          />
        ))
      )}
    </>
  );
};
