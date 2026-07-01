'use client';

import { Card } from '@/components/ui/card';
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SupportedOAuthProvider
} from '@/lib/auth/oauth-provider';
import { formatDate } from '../../utils/user-agent';
import { Icons } from '@/components/icons';
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { authClient } from '@/lib/auth/auth-client';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { toast } from 'sonner';

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export const LinkAccountCard = ({
  provider,
  account
}: {
  provider: string;
  account?: Account;
}) => {
  const router = useRouter();
  const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[
    provider as SupportedOAuthProvider
  ] ?? { name: provider, Icon: Icons.shield };

  const handelLinkAccount = () => {
    return authClient.linkSocial({
      provider,
      callbackURL: `/account/integrations`
    });
  };
  const handelUnLinkAccount = () => {
    if (!account) {
      return Promise.resolve({
        error: { message: 'No account found to unlink' }
      });
    }

    return authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId: provider
      },
      {
        onSuccess: () => {
          router.refresh();
        },
        onError: (error) => {
          toast.error(
            error.error?.message ||
              'Failed to unlink account. Please try again later.'
          );
          router.refresh();
        }
      }
    );
  };
  return (
    <Card className='rounded-xl border border-neutral-200 p-0 dark:border-neutral-500'>
      <div className='relative flex items-center justify-between p-6'>
        <div className='flex items-center gap-x-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'>
            {/* {userAgentInfo?.device?.type === 'mobile' ? (
              <Icons.mobile className='h-5 w-5' />
            ) : (
              <Icons.desktop className='h-5 w-5' />
              )} */}
            <providerDetails.Icon className='h-5 w-5' />
          </div>
          <div className='flex flex-col space-y-1'>
            <h2 className='text-base font-semibold'>{providerDetails.name}</h2>
          </div>
        </div>

        {/* <Badge variant={isCurrentSession ? 'default' : 'secondary'}>
          {isCurrentSession ? 'Current Session' : 'Other Session'}
        </Badge> */}
      </div>

      <div className='flex flex-col items-start justify-between gap-4 rounded-b-xl border-t border-neutral-200 bg-neutral-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:py-3 dark:border-neutral-700 dark:bg-neutral-800'>
        {/* <div className='flex flex-col'> */}
        {account ? (
          <p className='text-sm text-neutral-500'>
            Linked on - {formatDate(account.createdAt)}
          </p>
        ) : (
          <p className='text-sm text-neutral-500'>
            Connect you account with {providerDetails.name} to enable easy and
            secure sign-in.
          </p>
        )}
        {/* <p className='text-sm text-neutral-500'>
            Expires: {formatDate(session.expiresAt)}
          </p> */}
        {/* </div> */}
        {account ? (
          <BetterAuthActionButton
            type='submit'
            variant='destructive'
            size='sm'
            action={handelUnLinkAccount}
            className='cursor-pointer'
            successMessage='Account unlinked successfully'
          >
            <Icons.trash className='size-5' />
            Unlink
          </BetterAuthActionButton>
        ) : (
          <BetterAuthActionButton
            variant='default'
            size='sm'
            action={handelLinkAccount}
            className='cursor-pointer bg-(--brand-color)'
            successMessage='Account linked successfully'
          >
            <Icons.add className='size-5' />
            Link
          </BetterAuthActionButton>
        )}
      </div>
    </Card>
  );
};
