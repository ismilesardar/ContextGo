'use client';

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { Icons } from '@/components/icons';
import { authClient } from '@/lib/auth/auth-client';
import { getClient } from '@sentry/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function PasskeyAuthButtons() {
  const router = useRouter();
  const { refetch } = authClient.useSession();

  // useEffect(() => {
  //   authClient.signIn.passkey({ autoFill: true }, {
  //     onSuccess: () => {
  //       refetch();
  //       router.refresh();
  //       router.push('/');
  //     }
  //   })
  // }, [router, refetch]);

  return (
    <BetterAuthActionButton
      type='button'
      className='group border-border-subtle text-content-emphasis hover:bg-bg-muted focus-visible:border-border-emphasis data-[state=open]:border-border-emphasis data-[state=open]:ring-border-subtle mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-4 py-6 text-sm whitespace-nowrap transition-all outline-none data-[state=open]:ring-4 dark:bg-neutral-800'
      action={() =>
        authClient.signIn.passkey(undefined, {
          onSuccess: () => {
            refetch();
            router.push('/');
            router.refresh();
          }
        })
      }
    >
      <Icons.key />
      <div className='min-w-0 truncate'>Continue with Passkey</div>
    </BetterAuthActionButton>
  );
}
