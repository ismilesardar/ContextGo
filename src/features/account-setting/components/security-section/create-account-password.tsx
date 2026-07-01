'use client';

import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { Card } from '@/components/ui/card';
import { APP_NAME } from '@/config/url.config';
import { authClient } from '@/lib/auth/auth-client';
import { Account, User } from 'better-auth/types';

export const CreateAccountPassword = ({
  user,
  account
}: {
  user: User;
  account: Account;
}) => {
  return (
    <Card className='rounded-xl border p-0'>
      <div className='relative flex flex-col space-y-6 p-6'>
        <div className='flex flex-col space-y-1'>
          <h2 className='text-base font-semibold'>Password</h2>
          <p className='text-sm text-neutral-500'>
            Your account is managed by <strong>{account.providerId}</strong>.
            You can set a password to use with your {APP_NAME} account.
          </p>
        </div>
      </div>
      <div className='flex items-center justify-between space-x-4 rounded-b-lg border-t border-neutral-200 bg-neutral-50 px-6 py-3 dark:border-neutral-700 dark:bg-neutral-800'>
        <p className='text-sm text-neutral-500'>Create new password</p>
        <div className='w-fit shrink-0'>
          <BetterAuthActionButton
            variant='brand'
            action={() => {
              return authClient.requestPasswordReset({
                email: user.email,
                redirectTo: '/auth/reset-password'
              });
            }}
            successMessage={`We've sent you an email to ${user.email} with instructions to set your password`}
          >
            Create account password
          </BetterAuthActionButton>
        </div>
      </div>
    </Card>
  );
};
