'use client';

import { useUserSession } from '@/hooks/use-client-session';
import { PageShell } from '@/components/layout/page-shell';

export default function UnifiedOverviewView() {
  const { user } = useUserSession();

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <PageShell
      title={`Welcome back, ${firstName}`}
      description='This is your workspace overview.'
    >
      <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700'>
        <p className='text-muted-foreground text-sm'>
          Nothing to show here yet.
        </p>
      </div>
    </PageShell>
  );
}
