'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { redirect } from 'next/navigation';

export const OtherAccountLogin = () => {
  const handelOtherAccountLogin = async () => {
    await authClient.signOut();
    redirect('/auth/login');
  };
  return (
    <Button
      type='button'
      onClick={handelOtherAccountLogin}
      className='group border-border-subtle text-content-emphasis hover:bg-bg-muted flex h-8 w-fit cursor-pointer items-center justify-center gap-2 rounded-lg border bg-(--brand-color)/30 px-3 text-xs whitespace-nowrap shadow-sm transition-all'
    >
      <div className='min-w-0 truncate'>Sign in as a different user</div>
    </Button>
  );
};
