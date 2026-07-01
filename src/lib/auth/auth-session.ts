import { headers } from 'next/headers';
import { auth } from './auth';
import { cache } from 'react';

export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  return session;
});

export const getAccountListSession = cache(async () => {
  const account = await auth.api.listUserAccounts({
    headers: await headers()
  });
  const isPasswordAccount = account.some((a) => a.providerId === 'credential');

  return { account, isPasswordAccount };
});

export const getPasskeyList = cache(async () => {
  const passkey = await auth.api.listPasskeys({
    headers: await headers()
  });

  return passkey;
});
