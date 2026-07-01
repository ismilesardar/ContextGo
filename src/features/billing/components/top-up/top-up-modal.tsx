'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { authClient } from '@/lib/auth/auth-client';
import {
  TOP_UP_IMAGE_TOKEN_OPTIONS,
  TOP_UP_SYSTEM_TOKEN_OPTIONS
} from './top-up-config';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenType: 'system' | 'image';
  workspaceId: string;
}

export function TopUpModal({
  open,
  onOpenChange,
  tokenType,
  workspaceId
}: Props) {
  const pathname = usePathname();
  const [loading, setLoading] = useState<string | null>(null);
  const TOP_UP_OPTIONS =
    tokenType === 'system'
      ? TOP_UP_SYSTEM_TOKEN_OPTIONS
      : TOP_UP_IMAGE_TOKEN_OPTIONS;

  const title = tokenType === 'system' ? 'System Tokens' : 'Image Tokens';

  const handleTopUp = async (option: (typeof TOP_UP_OPTIONS)[number]) => {
    setLoading(`${option.amount}`);
    try {
      const { data, error } = await authClient.creem.createCheckout({
        productId: option.productId,
        successUrl: `${window.location.origin}${pathname}`,
        metadata: {
          organizationId: workspaceId,
          topUpType: tokenType,
          topUpAmount: String(option.tokens),
          topUpDollars: String(option.amount)
        }
      });

      if (error) {
        console.error('Top-up checkout failed:', error);
        setLoading(null);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Top-up error:', err);
      setLoading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-lg'>
            Buy {title}
          </DialogTitle>
        </DialogHeader>

        <div className='grid gap-3 py-4'>
          <p className='text-muted-foreground text-sm'>
            Select an amount to add{' '}
            {tokenType === 'system' ? 'system' : 'image'} tokens to your
            workspace.
          </p>

          {TOP_UP_OPTIONS.map((option) => (
            <button
              key={option.amount}
              onClick={() => handleTopUp(option)}
              disabled={loading !== null}
              className='group flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-5 py-4 text-left transition-all hover:border-neutral-900 hover:ring-1 hover:ring-neutral-900 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-500 dark:hover:ring-neutral-500'
            >
              <div className='flex items-center gap-3'>
                <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-sm font-semibold dark:bg-neutral-700'>
                  ${option.amount}
                </div>
                <div>
                  <div className='text-sm font-medium'>
                    {option.tokens.toLocaleString()} tokens
                  </div>
                  <div className='text-muted-foreground text-xs'>
                    ${option.amount} one-time
                  </div>
                </div>
              </div>
              <div className='text-muted-foreground text-xs'>
                {loading === `${option.amount}`
                  ? 'Redirecting...'
                  : `${((option.amount / option.tokens) * 1000).toFixed(
                      1
                    )}¢ /token`}
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
