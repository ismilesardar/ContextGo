'use client';

import { Button } from '@/components/ui/button';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';

export default function OverviewError({
  error,
  reset
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className='mx-auto flex max-w-md flex-col items-center justify-center p-6 pt-24'>
      <div className='w-full rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center shadow-sm backdrop-blur-sm dark:border-red-900 dark:bg-red-950/50'>
        <div className='mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50'>
          <IconAlertCircle className='size-6 text-red-600 dark:text-red-400' />
        </div>
        <p className='text-foreground text-lg font-semibold'>
          Overview — Something went wrong
        </p>
        <p className='text-muted-foreground mt-1.5 text-sm'>
          {error.message ||
            'An unexpected error occurred while loading the overview.'}
        </p>
        <Button
          onClick={reset}
          variant='outline'
          className='mt-5 cursor-pointer'
        >
          <IconRefresh className='mr-2 size-4' />
          Try again
        </Button>
      </div>
    </div>
  );
}
