'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/store';
import Link from 'next/link';

type TokenBannerProps = {
  tokenType?: 'system' | 'image' | 'additional-system' | 'additional-image';
  message?: string;
};

export function TokenBanner({
  tokenType = 'system',
  message
}: TokenBannerProps) {
  const { activeWorkspace } = useWorkspaceStore((state) => state);
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
  }, [pathname]);

  const copy = useMemo(() => {
    if (message) return message;

    switch (tokenType) {
      case 'image':
        return 'Image tokens are exhausted. Please buy more image tokens to continue using image features.';
      case 'additional-system':
        return 'Additional system tokens are unavailable because no active paid subscription is detected.';
      case 'additional-image':
        return 'Additional image tokens are unavailable because no active paid subscription is detected.';
      default:
        return 'System tokens are exhausted. Please buy more system tokens to continue using AI features.';
    }
  }, [message, tokenType]);

  if (
    dismissed ||
    !activeWorkspace ||
    activeWorkspace.systemTokenLimit !== activeWorkspace.systemTokenUsage ||
    activeWorkspace.imageTokenLimit !== activeWorkspace.imageTokenUsage
  )
    return null;
  return (
    <div className='border-warning/30 bg-warning/10 text-warning-foreground flex items-start justify-between gap-3 border-b px-4 py-2 text-sm'>
      <div>{copy}</div>
      <div className='flex items-center gap-2'>
        <Link
          href={`${activeWorkspace?.slug}/settings/billing`}
          className='border-warning/30 hover:bg-warning/20 rounded-md border px-3 py-1 text-xs font-medium'
        >
          Billing
        </Link>
        <button
          type='button'
          onClick={() => setDismissed(true)}
          aria-label='Dismiss token warning'
          className='hover:bg-warning/20 rounded-md px-2 py-1 text-lg leading-none'
        >
          ×
        </button>
      </div>
    </div>
  );
}
