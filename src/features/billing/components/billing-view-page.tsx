'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { authClient } from '@/lib/auth/auth-client';
import { STRIPE_PLANS } from '@/lib/plans/stripe';
import { Subscription } from '@better-auth/stripe';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import NumberFlow from '@number-flow/react';
import { useParams } from 'next/navigation';
import { useWorkspaceStore } from '@/store';
import SubscriptionMenu from '@/components/ui/workspaces/subscription-menu';
import { PLANS } from '@/utils/constants/pricing/pricing-plans';
import { usePlansStore } from '@/store/workspace-store/plan-store';
import { getFirstAndLastDay } from '@/utils/functions/datetime/get-first-and-last-day';
import { Icons } from '@/components/icons';
import { useTokenUsage } from '@/hooks/use-token-usage';
import { TokenUsageCharts } from './token-usage-charts';
import { TopUpModal } from './top-up/top-up-modal';
import { DynamicTooltipWrapper } from '@/components/ui/tooltip';

export const BillingViewPage = () => {
  const params = useParams();
  const { activeWorkspace } = useWorkspaceStore((state) => state);
  const { activePlan, refreshPlans } = usePlansStore((state) => state);
  // const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    if (activeWorkspace) {
      refreshPlans(activeWorkspace.id);
    }

    // authClient.subscription
    //   .list({ query: { referenceId: activeWorkspace.id } })
    //   .then((result) => {
    //     if (result.error) {
    //       setSubscriptions([]);
    //       toast.error('Failed to load subscriptions');
    //       return;
    //     }PlanDetails

    //     setSubscriptions(result.data);
    //   });
  }, [activeWorkspace]);

  // const activeSubscription = subscriptions.find(
  //   (sub) => sub.status === 'active' || sub.status === 'trialing'
  // );

  // const activePlan = PLANS.find(
  //   (plan) => plan.name === activeSubscription?.plan
  // );

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

  const [topUpTokenType, setTopUpTokenType] = useState<
    'system' | 'image' | null
  >(null);

  const { data: tokenEntries = [], isLoading: tokenLoading } = useTokenUsage(
    activeWorkspace?.id
  );

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
      {/* divider */}
      <div className='h-0.5 w-full bg-neutral-200 dark:bg-neutral-600'></div>

      <div className='grid gap-4 p-6 pb-0 sm:grid-cols-2 md:p-8 md:pb-0 lg:gap-6'>
        <div className='relative'>
          <div
            className='w-full rounded-lg border border-neutral-900 bg-white px-4 py-3 text-left ring-1 ring-neutral-900 transition-colors duration-75 outline-none hover:bg-neutral-50 focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600 lg:px-5 lg:py-4 dark:border-neutral-700 dark:bg-neutral-800'
            aria-selected='true'
          >
            <Icons.clickCourser className='size-5 text-neutral-600' />

            <div className='mt-1.5 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400'>
              System Token
            </div>
            <div className='mt-1.5'>
              {/* <number-flow-react className="text-2xl font-medium leading-none text-neutral-900" aria-label="0" role="img"></number-flow-react> */}
              <NumberFlow
                value={0}
                className='text-2xl leading-none font-medium text-neutral-900 dark:text-neutral-400'
              />
            </div>
            <div
              className='overflow-hidden'
              style={{ width: 'auto', height: '48px' }}
            >
              <div className='h-max'>
                <div className='h-12'>
                  <div className='mt-4'>
                    <div className='h-1 w-full overflow-hidden rounded-full bg-neutral-900/10 transition-colors'>
                      <div
                        className='animate-slide-right-fade size-full'
                        style={{ ['--offset' as any]: '-100%' }}
                      >
                        <div
                          className='size-full rounded-full bg-neutral-800'
                          style={{ transform: 'translateX(-100%)' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-2 leading-none'>
                    <span className='text-xs leading-none font-medium text-neutral-600 dark:text-neutral-400'>
                      {(activeWorkspace?.systemTokenLimit ?? 0) -
                        (activeWorkspace?.systemTokenUsage ?? 0) +
                        ((activeWorkspace?.additionalSystemToken ?? 0) -
                          (activeWorkspace?.additionalSystemTokenUsage ??
                            0))}{' '}
                      remaining of{' '}
                      {(activeWorkspace?.systemTokenLimit ?? 0) +
                        (activeWorkspace?.additionalSystemToken ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='absolute top-3 right-3'>
            <DynamicTooltipWrapper
              tooltipProps={
                activeWorkspace &&
                activeWorkspace?.plan?.toLocaleLowerCase() === 'free'
                  ? { content: 'Available on paid plans only.' }
                  : undefined
              }
            >
              <Button
                type='button'
                disabled={activeWorkspace?.plan?.toLocaleLowerCase() === 'free'}
                onClick={() => setTopUpTokenType('system')}
                className='group border-border-subtle text-content-emphasis hover:bg-bg-muted focus-visible:border-border-emphasis data-[state=open]:border-border-emphasis data-[state=open]:ring-border-subtle flex h-6 w-full cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-1.5 text-xs whitespace-nowrap transition-all outline-none data-[state=open]:ring-4 dark:bg-black'
              >
                <div className='min-w-0 truncate'>Top Up</div>
                {activeWorkspace?.plan?.toLocaleLowerCase() === 'free' && (
                  <Icons.crown className='size-3.5' />
                )}
              </Button>
            </DynamicTooltipWrapper>
          </div>
        </div>

        <div className='relative'>
          <div
            className='w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-left transition-colors duration-75 outline-none hover:bg-neutral-50 focus-visible:border-blue-600 focus-visible:ring-1 focus-visible:ring-blue-600 lg:px-5 lg:py-4 dark:border-neutral-700 dark:bg-neutral-800'
            aria-selected='false'
          >
            <Icons.imageGeneration className='size-4 text-neutral-600' />
            <div className='mt-1.5 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300'>
              Image Token
            </div>
            <div className='mt-1.5'>
              {/* <number-flow-react className="text-2xl font-medium leading-none text-neutral-900" aria-label="0" role="img"></number-flow-react> */}
              <NumberFlow
                value={0}
                className='text-2xl leading-none font-medium text-neutral-900 dark:text-neutral-400'
              />
            </div>
            <div
              className='overflow-hidden'
              style={{ width: 'auto', height: '48px' }}
            >
              <div className='h-max'>
                <div className='h-12'>
                  <div className='mt-4'>
                    <div className='h-1 w-full overflow-hidden rounded-full bg-neutral-900/10 transition-colors'>
                      <div
                        className='animate-slide-right-fade size-full'
                        style={{ ['--offset' as any]: '-100%' }}
                      >
                        <div
                          className='size-full rounded-full bg-neutral-800'
                          style={{ transform: 'translateX(-100%)' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-2 leading-none'>
                    <span className='text-xs leading-none font-medium text-neutral-600 dark:text-neutral-400'>
                      {(activeWorkspace?.imageTokenLimit ?? 0) -
                        (activeWorkspace?.imageTokenUsage ?? 0) +
                        ((activeWorkspace?.additionalImageToken ?? 0) -
                          (activeWorkspace?.additionalImageTokenUsage ??
                            0))}{' '}
                      remaining of{' '}
                      {(activeWorkspace?.imageTokenLimit ?? 0) +
                        (activeWorkspace?.additionalImageToken ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='absolute top-3 right-3'>
            <DynamicTooltipWrapper
              tooltipProps={
                activeWorkspace &&
                activeWorkspace?.plan?.toLocaleLowerCase() === 'free'
                  ? { content: 'Available on paid plans only.' }
                  : undefined
              }
            >
              <Button
                type='button'
                disabled={activeWorkspace?.plan?.toLocaleLowerCase() === 'free'}
                onClick={() => setTopUpTokenType('image')}
                className='group border-border-subtle text-content-emphasis hover:bg-bg-muted focus-visible:border-border-emphasis data-[state=open]:border-border-emphasis data-[state=open]:ring-border-subtle flex h-6 w-full cursor-pointer items-center justify-center gap-2 rounded-md border bg-white px-1.5 text-xs whitespace-nowrap transition-all outline-none data-[state=open]:ring-4 dark:bg-black'
              >
                <div className='min-w-0 truncate'>Top Up</div>
                {activeWorkspace?.plan?.toLocaleLowerCase() === 'free' && (
                  <Icons.crown className='size-3.5' />
                )}
              </Button>
            </DynamicTooltipWrapper>
          </div>
        </div>
      </div>

      <div className='mt-6 px-6 pb-6 md:px-8 md:pb-8'>
        <TokenUsageCharts entries={tokenEntries} isLoading={tokenLoading} />
      </div>

      <TopUpModal
        open={topUpTokenType !== null}
        onOpenChange={(open) => {
          if (!open) setTopUpTokenType(null);
        }}
        tokenType={topUpTokenType ?? 'system'}
        workspaceId={activeWorkspace?.id ?? ''}
      />
    </Card>
  );
};
