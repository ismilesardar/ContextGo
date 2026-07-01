import { Spinner } from '@/components/ui/spinner';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import React from 'react';
import { CurrentLinkedAccounts } from './link-accounts-section/current-linked-accounts';
import { OtherLinkedAccounts } from './link-accounts-section/other-linked-accounts';

export const IntegrationsViewPage = async () => {
  const listOfAccounts = await auth.api.listUserAccounts({
    headers: await headers()
  });
  const nonCredentialsAccounts = listOfAccounts.filter(
    (a) => a.providerId !== 'credential'
  );

  return (
    <>
      {listOfAccounts ? (
        <div className='flex w-full flex-col gap-y-10 pb-10'>
          <CurrentLinkedAccounts currentAccounts={nonCredentialsAccounts} />
          <OtherLinkedAccounts currentAccounts={nonCredentialsAccounts} />
        </div>
      ) : (
        <div className='flex size-full items-center justify-center'>
          <Spinner />
        </div>
      )}
    </>
  );
};
