'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { APP_NAME } from '@/config/url.config';
import { User } from 'better-auth/types';
import * as React from 'react';
import { toast } from 'sonner';

export const EmailSection = ({ user }: { user: User }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!user?.email) return;

    try {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      toast.success('Email copied to clipboard');

      // Reset the icon back to "copy" after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy email');
    }
  };

  return (
    <Card className='rounded-xl border p-0'>
      <div className='relative flex flex-col space-y-6 p-6'>
        <div className='flex flex-col space-y-1'>
          <h2 className='text-base font-semibold'>Your Email</h2>
          <p className='text-sm text-neutral-500'>
            This will be the email you use to log in to {APP_NAME} and receive
            notifications.
          </p>
        </div>
        <div className='flex w-full max-w-md items-center justify-between rounded-md border border-neutral-300 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800'>
          <p className='pl-2 text-sm text-neutral-500'>{user?.email}</p>
          <Button
            className='group relative cursor-pointer rounded-md bg-transparent p-1 transition-all duration-75 hover:bg-neutral-100 active:bg-neutral-200 dark:hover:bg-neutral-600'
            type='button'
            onClick={handleCopy}
          >
            <span className='sr-only'>Copy</span>
            {/* Toggle between Copy and Check icon */}
            {copied ? (
              <Icons.check className='size-5 text-green-500' />
            ) : (
              <Icons.copy className='size-5 text-neutral-500 dark:text-neutral-300' />
            )}
          </Button>
        </div>
      </div>
      <div className='flex items-center justify-between space-x-4 rounded-b-lg border-t border-neutral-200 bg-neutral-50 px-6 py-5 dark:border-neutral-700 dark:bg-neutral-800'>
        <p className='text-sm text-neutral-500'>Email not changeable!</p>
      </div>
    </Card>
  );
};
