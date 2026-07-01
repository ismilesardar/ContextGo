'use client';

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { Card } from '@/components/ui/card';
import { authClient } from '@/lib/auth/auth-client';
import { Session } from 'better-auth/types';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { UAParser } from 'ua-parser-js';
import { formatDate, getUserBrowserInfo } from '../../utils/user-agent';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';

export const SessionCard = ({
  session,
  isCurrentSession
}: {
  session: Session;
  isCurrentSession: boolean;
}) => {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  const handelRevokeSession = async () => {
    if (!session.token) return { error: { message: 'No session token found' } };

    return authClient.revokeSession(
      { token: session.token },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: (error) => {
          router.refresh();
          toast.error(
            error.error?.message ||
              'Failed to revoke session. Please try again later.'
          );
        }
      }
    );
  };
  return (
    <Card className='rounded-xl border p-0'>
      <div className='relative flex items-center justify-between p-6'>
        <div className='flex items-center gap-x-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'>
            {userAgentInfo?.device?.type === 'mobile' ? (
              <Icons.mobile className='h-5 w-5' />
            ) : (
              <Icons.desktop className='h-5 w-5' />
            )}
          </div>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>
              {getUserBrowserInfo({ userAgentInfo })}
            </h2>
          </div>
        </div>

        <Badge variant={isCurrentSession ? 'default' : 'secondary'}>
          {isCurrentSession ? 'Current Session' : 'Other Session'}
        </Badge>
      </div>

      <div className='flex flex-col items-start justify-between gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
        <div className='flex flex-col'>
          <p className='text-sm text-neutral-500'>
            Created: {formatDate(session.createdAt)}
          </p>
          <p className='text-sm text-neutral-500'>
            Expires: {formatDate(session.expiresAt)}
          </p>
        </div>
        {!isCurrentSession && (
          <BetterAuthActionButton
            type='submit'
            variant='destructive'
            size='lg'
            action={handelRevokeSession}
            className='cursor-pointer'
            successMessage='Session revoked successfully'
          >
            <Icons.trash className='size-5' />
          </BetterAuthActionButton>
        )}
      </div>
    </Card>
  );
};
