import { auth } from '@/lib/auth/auth';
import React from 'react';
import { LinkAccountCard } from './link-account-card';
type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export const CurrentLinkedAccounts = ({
  currentAccounts
}: {
  currentAccounts: Account[];
}) => {
  return (
    <>
      <h1 className='text-2xl font-bold'>Linked Accounts</h1>
      {currentAccounts.length > 0 ? (
        currentAccounts.map((account) => (
          <LinkAccountCard
            key={account.id}
            provider={account.providerId}
            account={account}
          />
        ))
      ) : (
        <div className='flex items-center justify-center'>
          <p className='text-sm text-neutral-500'>No linked accounts found.</p>
        </div>
      )}
    </>
  );
};
