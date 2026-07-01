'use client';

import { authClient } from '@/lib/auth/auth-client';
import { UserX } from 'lucide-react';
import { BetterAuthActionButton } from './better-auth-action-button';
import { useRouter } from 'next/navigation';
import { useUserSession } from '@/hooks/use-client-session';

export function ImpersonationIndicator() {
  const router = useRouter();
  const { session, refreshSession } = useUserSession();

  if (session?.impersonatedBy == null) return null;

  return (
    <BetterAuthActionButton
      action={() =>
        authClient.admin.stopImpersonating(undefined, {
          onSuccess: () => {
            refreshSession();
            router.push('/account/admin');
          }
        })
      }
      variant='destructive'
      size='icon'
      showChildren={false}
    >
      <UserX className='size-4' />
    </BetterAuthActionButton>
  );
}
