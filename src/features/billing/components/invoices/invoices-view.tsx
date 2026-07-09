'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { removeWordFromPath } from '@/utils/helper-functions';
import { authClient } from '@/lib/auth/auth-client';
import { useWorkspaceStore } from '@/store';
import { useInvoices } from '@/hooks/use-invoices';
import { format } from 'date-fns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import type { Invoice } from '@/app/api/billing/invoices/route';

const PLAN_LABELS: Record<string, string> = {
  prod_P5SZIQLfBwdz98zYLFVRe: 'Pro (Yearly)',
  prod_17RAtntpGPp2yUhcI7b4F3: 'Pro (Monthly)',
  prod_26NTQwUKp8Hw7JOAFcqWxo: 'Business (Yearly)',
  prod_3ec8VHg3TLUCujcczSMKyu: 'Business (Monthly)',
  prod_2xge9jCvzl4qXGpugKMxaz: 'Advanced (Yearly)',
  prod_2UYyqwc8XHYwonPXc9YuTI: 'Advanced (Monthly)'
};

const STATUS_BADGES: Record<string, string> = {
  active:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  trialing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  incomplete:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  past_due: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  canceled:
    'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  completed:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
};

function InvoiceRow({
  invoice,
  onDownload
}: {
  invoice: Invoice;
  onDownload: () => void;
}) {
  const isSubscription = invoice.type === 'subscription';
  const statusClass = STATUS_BADGES[invoice.status] ?? STATUS_BADGES.completed;

  const date = invoice.createdAt
    ? format(new Date(invoice.createdAt), 'MMM d, yyyy')
    : '—';

  const amount =
    'currency' in invoice && invoice.currency
      ? `$${((invoice.amount ?? 0) / 100).toLocaleString()} ${invoice.currency}`
      : invoice.amount
        ? `$${invoice.amount}`
        : null;

  return (
    <div className='dark:hover:bg-neutral-750 flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-5 py-4 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800'>
      <div className='flex items-center gap-4'>
        {/* Icon */}
        <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-700'>
          {isSubscription ? (
            <Icons.fileText className='size-5 text-neutral-600' />
          ) : (
            <Icons.moneyBag className='size-5 text-neutral-600' />
          )}
        </div>

        {/* Details */}
        <div>
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>
              {isSubscription
                ? `${PLAN_LABELS[invoice.productId] ?? 'Subscription'}${amount ? ` — ${amount}` : ''}`
                : `Order — ${amount}`}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}
            >
              {invoice.status}
            </span>
          </div>
          <div className='mt-0.5 text-xs text-neutral-500 dark:text-neutral-400'>
            {isSubscription ? (
              <>
                {invoice.periodStart
                  ? format(new Date(invoice.periodStart), 'MMM d, yyyy')
                  : '—'}{' '}
                →{' '}
                {invoice.periodEnd
                  ? format(new Date(invoice.periodEnd), 'MMM d, yyyy')
                  : '—'}
              </>
            ) : (
              'One-time purchase'
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <span className='text-xs text-neutral-500 dark:text-neutral-400'>
          {date}
        </span>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-7 text-xs'
          onClick={onDownload}
        >
          Invoice
        </Button>
      </div>
    </div>
  );
}

export const InvoicesView = () => {
  const pathName = usePathname();
  const { activeWorkspace } = useWorkspaceStore((state) => state);
  const { data: invoices = [], isLoading } = useInvoices(activeWorkspace?.id);

  const subscriptionInvoices = invoices.filter(
    (inv) => inv.type === 'subscription'
  );
  const orderInvoices = invoices.filter((inv) => inv.type === 'order');

  const handlePortal = async () => {
    const customerId = activeWorkspace?.creemId;
    if (!customerId) return;
    const { data, error } = await authClient.creem.createPortal({
      customerId
    });
    if (error) {
      console.error('Failed to open Creem portal:', error);
      return;
    }
    if (data?.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className='size-full bg-transparent pt-3 lg:pt-6'>
      <div className='@container/page px-3 lg:px-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <SidebarMenuButton
            title='Back to billing'
            className='w-fit bg-transparent p-0 hover:bg-transparent'
          >
            <Link
              className='group/header flex items-center gap-3 pt-2 pr-3 pl-1'
              href={removeWordFromPath(pathName, 'invoices')}
            >
              <div className='bg-sidebar-accent-foreground/15 text-secondary-foreground group-hover/header:bg-sidebar-accent-foreground/20 group-hover/header:text-secondary-foreground flex size-6 items-center justify-center rounded-md shadow-xs transition-[transform,background-color,color] duration-150 group-hover/header:-translate-x-0.5'>
                <Icons.chevronLeft className='w-4 group-hover/header:w-5' />
              </div>
              <span className='text-secondary-foreground text-lg font-semibold'>
                Invoices
              </span>
            </Link>
          </SidebarMenuButton>

          {activeWorkspace?.creemId && (
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={handlePortal}
            >
              Creem Portal
            </Button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className='mt-8 space-y-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className='h-16 animate-pulse rounded-lg bg-neutral-100 dark:bg-neutral-800'
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && invoices.length === 0 && (
          <div className='mt-16 flex flex-col items-center gap-2 text-center'>
            <Icons.billing className='size-8 text-neutral-300 dark:text-neutral-600' />
            <p className='text-sm text-neutral-500 dark:text-neutral-400'>
              No invoices yet
            </p>
          </div>
        )}

        {/* Subscription invoices */}
        {!isLoading && subscriptionInvoices.length > 0 && (
          <div className='mt-8'>
            <h3 className='mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Subscriptions
            </h3>
            <div className='space-y-2'>
              {subscriptionInvoices.map((inv) => (
                <InvoiceRow
                  key={inv.id}
                  invoice={inv}
                  onDownload={handlePortal}
                />
              ))}
            </div>
          </div>
        )}

        {/* Orders (Creem one-time purchases) */}
        {!isLoading && orderInvoices.length > 0 && (
          <div className='mt-8 pb-6'>
            <h3 className='mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300'>
              Orders
            </h3>
            <div className='space-y-2'>
              {orderInvoices.map((inv) => (
                <InvoiceRow
                  key={inv.id}
                  invoice={inv}
                  onDownload={handlePortal}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
