'use client';

import { Button } from '@/components/ui/button';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { usePathname } from 'next/navigation';

/** Human-readable route name from the URL path */
function routeLabel(pathname: string): string {
  const segment = pathname.split('/').pop() || '';
  const map: Record<string, string> = {
    overview: 'Overview',
    settings: 'Settings'
  };
  return (
    map[segment] ||
    segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export default function WorkspaceError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className='mx-auto flex max-w-md flex-col items-center justify-center p-6 pt-24'>
      <div className='w-full rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center shadow-sm backdrop-blur-sm dark:border-red-900 dark:bg-red-950/50'>
        <div className='mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50'>
          <IconAlertCircle className='size-6 text-red-600 dark:text-red-400' />
        </div>

        <p className='text-foreground text-lg font-semibold'>
          {routeLabel(pathname)} — Something went wrong
        </p>
        <p className='text-muted-foreground mt-1.5 text-sm'>
          {error.message ||
            'An unexpected error occurred while loading this page.'}
        </p>

        <div className='mt-5 flex items-center justify-center gap-3'>
          <Button onClick={reset} variant='outline' className='cursor-pointer'>
            <IconRefresh className='mr-2 size-4' />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
