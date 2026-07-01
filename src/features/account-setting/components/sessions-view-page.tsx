import { getServerSession } from '@/lib/auth/auth-session';
import React from 'react';
import { CurrentSession } from './sessions-section/current-session';
import { auth } from '@/lib/auth/auth';
import { headers } from 'next/headers';
import { OtherSession } from './sessions-section/other-session';
import { Spinner } from '@/components/ui/spinner';

export async function SessionsViewPage() {
  const session = await getServerSession();
  const listOfSessions = await auth.api.listSessions({
    headers: await headers()
  });

  return (
    <>
      {session ? (
        <div className='flex w-full flex-col gap-y-10 pb-10'>
          <CurrentSession
            currentSessionToken={session?.session.token}
            listOfSessions={listOfSessions}
          />
          <OtherSession
            currentSessionToken={session?.session.token}
            listOfSessions={listOfSessions}
          />
        </div>
      ) : (
        <div className='flex size-full items-center justify-center'>
          <Spinner />
        </div>
      )}
    </>
  );
}
