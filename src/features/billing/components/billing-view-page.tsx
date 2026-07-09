'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import NumberFlow from '@number-flow/react';
import { useParams } from 'next/navigation';
import { useWorkspaceStore } from '@/store';
import SubscriptionMenu from '@/components/ui/workspaces/subscription-menu';
import { usePlansStore } from '@/store/workspace-store/plan-store';
import { getFirstAndLastDay } from '@/utils/functions/datetime/get-first-and-last-day';
import { useResourceUsage } from '@/hooks/use-resource-usage';

export const BillingViewPage = () => {
  const params = useParams();
  const { activeWorkspace } = useWorkspaceStore((state) => state);
  const { activePlan, refreshPlans } = usePlansStore((state) => state);

  useEffect(() => {
    if (activeWorkspace) {
      refreshPlans(activeWorkspace.id);
    }
  }, [activeWorkspace]);

  const [billingStart, billingEnd] = useMemo(() => {
    if (activeWorkspace?.lastResetDate) {
      const { firstDay, lastDay } = getFirstAndLastDay(
        activeWorkspace.lastResetDate.getDate()
      );
      const start = firstDay.toLocaleDateString('en-us', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const end = lastDay.toLocaleDateString('en-us', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return [start, end];
    }
    return [];
  }, [activeWorkspace?.lastResetDate]);

  const { data: resourceUsage = [], isLoading: usageLoading } =
    useResourceUsage(activeWorkspace?.id);

  const paramsSlug = Array.isArray(params.workspace)
    ? params.workspace[0]
    : params.workspace;

  return (
    <Card className='dark:bg-card flex-1 gap-0 overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 dark:border-neutral-600'>
      <div className='flex flex-col items-start justify-between gap-y-4 p-6 md:px-8 lg:flex-row'>
        <div>
          <h2 className='text-xl font-medium'>
            {activePlan?.name ?? 'Free'} Plan
          </h2>
          <p className='mt-1.5 text-sm leading-normal font-medium text-balance text-neutral-700 dark:text-neutral-500'>
            Current billing cycle:{' '}
            <span className='font-normal'>
              {billingStart} - {billingEnd}
            </span>
          </p>
        </div>
        <div className='flex items-center gap-2'>
          {activeWorkspace?.plan !== 'enterprise' && (
            <Link href={`/${paramsSlug}/settings/billing/upgrade`}>
              <Button type='submit' variant='brand'>
                <div className='min-w-0 truncate'>
                  {activeWorkspace?.plan === 'free' || !activeWorkspace?.plan
                    ? 'Upgrade'
                    : 'Manage plan'}
                </div>
              </Button>
            </Link>
          )}
          <Link href={`/${paramsSlug}/settings/billing/invoices`}>
            <Button type='submit'>
              <div className='min-w-0 truncate'>View invoices</div>
            </Button>
          </Link>

          {activeWorkspace?.creemId &&
            activeWorkspace?.plan !== 'free' &&
            activeWorkspace?.plan !== 'Free' && (
              <SubscriptionMenu activeSubscription={activePlan} />
            )}
        </div>
      </div>
      {activeWorkspace?.subscriptionCanceledAt && (
        <div className='mx-6 mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 md:mx-8 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-400'>
          Your subscription has been canceled.{' '}
          {activeWorkspace?.subscriptionEndsAt
            ? `You'll keep access to your current plan until ${activeWorkspace.subscriptionEndsAt.toLocaleDateString(
                'en-us',
                { month: 'short', day: 'numeric', year: 'numeric' }
              )}, after which your workspace will move to the Free plan.`
            : 'Your workspace will move to the Free plan at the end of the current billing period.'}
        </div>
      )}

      {/* divider */}
      <div className='h-0.5 w-full bg-neutral-200 dark:bg-neutral-600'></div>

      <div className='grid gap-4 p-6 pb-6 sm:grid-cols-2 md:p-8 md:pb-8 lg:grid-cols-3 lg:gap-6'>
        {usageLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='h-20 animate-pulse rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800'
            />
          ))}

        {!usageLoading &&
          resourceUsage.map((item) => (
            <div
              key={item.key}
              className='w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-left dark:border-neutral-700 dark:bg-neutral-800'
            >
              <div className='text-sm text-neutral-600 dark:text-neutral-400'>
                {item.label}
              </div>
              <div className='mt-1.5'>
                <NumberFlow
                  value={item.used}
                  className='text-2xl leading-none font-medium text-neutral-900 dark:text-neutral-400'
                />
              </div>
              <div className='mt-3'>
                <div className='h-1 w-full overflow-hidden rounded-full bg-neutral-900/10'>
                  <div
                    className='h-full rounded-full bg-neutral-800 transition-all dark:bg-neutral-300'
                    style={{
                      width: `${item.limit > 0 ? Math.min(100, (item.used / item.limit) * 100) : 100}%`
                    }}
                  />
                </div>
                <div className='mt-2 text-xs leading-none font-medium text-neutral-600 dark:text-neutral-400'>
                  {item.used} of {item.limit} used this period
                </div>
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
};
