'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { useWorkspaceStore } from '@/store';
import { removeWordFromPath } from '@/utils/helper-functions';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BillingOptionsTable } from './billing-options-table';
import { cn } from '@/lib/utils';
import {
  isDowngradePlan,
  PlanDetails,
  PLANS
} from '@/utils/constants/pricing/pricing-plans';
import NumberFlow from '@number-flow/react';
import {
  ChartLine,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image,
  LucideIcon,
  MessageCircleQuestion,
  Plug2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2
} from 'lucide-react';
import { PRICING_PLAN_COMPARE_FEATURES } from '@/utils/constants/pricing/pricing-plan-compare-features';
import { BetterAuthActionButton } from '@/components/auth/better-auth-action-button';
import { DynamicTooltipWrapper } from '@/components/ui/tooltip';
import { clientAccessCheck } from '@/lib/client-access-check';
import { authClient } from '@/lib/auth/auth-client';
import { usePlansStore } from '@/store/workspace-store/plan-store';
import { EnterpriseContactModal } from './enterprise-contact-modal';
import { ChangePlanConfirmationModal } from './change-plan-confirmation-modal';

const COMPARE_FEATURE_ICONS: Record<
  (typeof PRICING_PLAN_COMPARE_FEATURES)[number]['category'],
  LucideIcon
> = {
  Analytics: ChartLine,
  Compliance: ShieldCheck,
  'Listing Content': FileText,
  'Advertising & Growth': TrendingUp,
  'Image Tools': Image,
  'Resources & Limits': Sparkles,
  'Team & Workspace': Users2,
  'API & Integrations': Plug2,
  Support: MessageCircleQuestion
};

export const UpgradeView = () => {
  const pathName = usePathname();
  const { activeWorkspace } = useWorkspaceStore((state) => state);
  const activeMember = useWorkspaceStore((state) => state.activeMember);
  const { activePlan } = usePlansStore((state) => state);

  const permissionsError = clientAccessCheck({
    action: 'billing.write',
    role: activeMember?.role ?? 'viewer'
  }).error;

  const [billingMonth, setBillingMonth] = useState<boolean>(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [changePlanTarget, setChangePlanTarget] = useState<PlanDetails | null>(
    null
  );

  const [mobilePlanIndex, setMobilePlanIndex] = useState(0);
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans: { plan: PlanDetails; planTier: number }[] = useMemo(
    () =>
      ['Pro', 'Business', 'Advanced', 'Enterprise'].map((p) => {
        const planDetails = PLANS.find(({ name }) => name === p)!;
        return { plan: planDetails, planTier: 1 };
      }),
    []
  );

  const handelBillingOptions = (
    billingType: 'monthly' | 'yearly' = 'monthly'
  ) => {
    const isMonthly = billingType === 'monthly';

    setPeriod(billingType);
    setBillingMonth(isMonthly);
  };

  const handelSubscriptions = (plan: PlanDetails) => {
    if (!activeWorkspace) {
      return Promise.resolve({ error: { message: 'No active organization' } });
    }

    const productId =
      period === 'yearly' ? plan.price.ids?.[0] : plan.price.ids?.[1];
    if (!productId) {
      return Promise.resolve({
        error: { message: 'No product ID for this plan' }
      });
    }

    const successUrl = `${window.location.origin}${pathName.replace('/upgrade', '/success')}`;
    return authClient.creem.createCheckout({
      productId,
      successUrl,
      metadata: {
        organizationId: activeWorkspace.id,
        planName: plan.name,
        planPeriod: period
      }
    });
  };

  return (
    <Card className='size-full bg-transparent pt-3 lg:pt-6'>
      <div className='@container/page px-3 lg:px-6'>
        {/* top label */}
        <div className='flex justify-between p-0 lg:flex-row'>
          <SidebarMenuButton
            title='Back to billing'
            className='w-fit bg-transparent p-0 hover:bg-transparent'
          >
            <Link
              className='group/header flex items-center gap-3 pt-2 pr-3 pl-1'
              href={removeWordFromPath(pathName, 'upgrade')}
            >
              <div className='bg-sidebar-accent-foreground/15 text-secondary-foreground group-hover/header:bg-sidebar-accent-foreground/20 group-hover/header:text-secondary-foreground flex size-6 items-center justify-center rounded-md shadow-xs transition-[transform,background-color,color] duration-150 group-hover/header:-translate-x-0.5'>
                <Icons.chevronLeft className='w-4 group-hover/header:w-5' />
              </div>
              <span className='text-secondary-foreground text-lg font-semibold'>
                Plans
              </span>
            </Link>
          </SidebarMenuButton>

          <div className='relative z-0 inline-flex items-center gap-1 rounded-md border border-neutral-300 bg-neutral-100 p-0.5 dark:border-neutral-600 dark:bg-neutral-800'>
            <Button
              type='button'
              onClick={() => handelBillingOptions('monthly')}
              data-selected={billingMonth}
              className={`${billingMonth ? 'relative z-10' : '-z-1 hover:bg-neutral-300/30 dark:hover:bg-neutral-700/30'} flex h-7 cursor-pointer items-center gap-2 border-0 bg-transparent px-2 py-1 text-xs font-medium text-neutral-800 capitalize transition-all delay-150 duration-400 ease-in-out data-[selected=true]:text-neutral-800 sm:px-4 dark:text-neutral-400 dark:data-[selected=true]:text-neutral-300`}
            >
              <p>Monthly</p>
              {billingMonth && (
                <div
                  className='absolute top-0 left-0 -z-1 h-full w-full rounded-[7px] border border-neutral-200 bg-white transition-all delay-150 duration-500 ease-out dark:border-neutral-500 dark:bg-neutral-600'
                  style={{
                    transform: 'none',
                    transformOrigin: '50% 50% 0px',
                    animation: billingMonth ? 'slideIn 1.5s ease-out' : 'none'
                  }}
                ></div>
              )}
            </Button>
            <Button
              type='button'
              onClick={() => handelBillingOptions('yearly')}
              data-selected={!billingMonth}
              className={`${!billingMonth ? 'relative z-10' : '-z-1 hover:bg-neutral-300/30 dark:hover:bg-neutral-700/30'} flex h-7 cursor-pointer items-center gap-2 border-0 bg-transparent px-2 py-1.5 text-xs leading-none font-medium text-neutral-800 capitalize transition-all delay-150 duration-400 ease-in-out data-[selected=true]:text-neutral-800 sm:px-4 dark:text-neutral-400 dark:data-[selected=true]:text-neutral-300`}
            >
              <p>Yearly (Save 21%)</p>
              {!billingMonth && (
                <div
                  className='absolute top-0 left-0 -z-1 h-full w-full rounded-[7px] border border-neutral-100 bg-white transition-all delay-150 duration-500 ease-out dark:border-neutral-500 dark:bg-neutral-600'
                  style={{
                    transform: 'none',
                    transformOrigin: '50% 50% 0px',
                    animation: !billingMonth ? 'slideIn 1.5s ease-out' : 'none'
                  }}
                ></div>
              )}
            </Button>
          </div>
        </div>

        <div className='mt-6'>
          <div className='sticky -top-px z-10'>
            <div className='@container overflow-x-hidden rounded-b-[12px] from-neutral-200 lg:bg-linear-to-t lg:p-px dark:from-neutral-600'>
              <div
                className={cn(
                  'grid grid-cols-4 gap-px overflow-hidden rounded-b-[11px] text-sm text-neutral-800 [&_strong]:font-medium',

                  // Mobile
                  'max-lg:w-[calc(400cqw+3*32px)] max-lg:translate-x-[calc(-1*var(--index)*(100cqw+32px))] max-lg:gap-x-8 max-lg:transition-transform'
                )}
                style={
                  {
                    '--index': mobilePlanIndex
                  } as CSSProperties
                }
              >
                {plans.map(
                  (
                    { plan, planTier }: { plan: PlanDetails; planTier: number },
                    idx
                  ) => {
                    // disable upgrade button if user has a Stripe ID and is on the current plan
                    // (if there's no stripe id, they could be on a free trial so they should be able to upgrade)
                    // edge case:
                    //    if the user is on the business plan and has a payout limit of 0,
                    //    it means they're on the legacy business plan – prompt them to upgrade to the new business plan
                    const disableCurrentPlan = Boolean(
                      activeWorkspace?.creemId &&
                        plan.name.toLowerCase() ===
                          activeWorkspace?.plan?.toLowerCase()
                    );

                    // show downgrade button if user has a creem id and is on the current plan
                    const isDowngrade = Boolean(
                      activeWorkspace?.creemId &&
                        isDowngradePlan({
                          currentPlan: activeWorkspace?.plan || 'free',
                          newPlan: plan.name
                        })
                    );

                    // an existing paid (non-Free) subscription can be changed
                    // in place; a first-time subscribe still needs checkout
                    // to collect a payment method
                    const hasActiveSubscription = Boolean(
                      activeWorkspace?.creemId &&
                        activeWorkspace?.plan &&
                        activeWorkspace.plan.toLowerCase() !== 'free'
                    );

                    const buttonLabel =
                      activeWorkspace?.plan?.toLowerCase() === 'enterprise'
                        ? 'Contact support'
                        : disableCurrentPlan
                          ? 'Current plan'
                          : isDowngrade
                            ? 'Downgrade'
                            : 'Upgrade';

                    return (
                      <div
                        key={plan.name}
                        className={cn(
                          'relative top-0 flex h-full flex-col gap-6 bg-white p-5 lg:p-3 xl:p-5 dark:bg-neutral-950',
                          'max-lg:rounded-xl max-lg:border max-lg:border-neutral-200 dark:max-lg:border-neutral-700',

                          idx !== mobilePlanIndex && 'max-lg:opacity-0'
                        )}
                      >
                        <div>
                          <div className='flex items-start justify-between gap-2'>
                            <h3 className='py-1 text-base leading-none font-semibold text-neutral-800 dark:text-neutral-400'>
                              {plan.name}
                            </h3>
                            {!isDowngrade &&
                              plan.name === 'Business' &&
                              !disableCurrentPlan && (
                                <div className='animate-fade-in flex h-6 min-w-0 items-center rounded-lg border border-blue-100 bg-blue-50 px-1.5 text-xs font-medium text-blue-600 dark:border-blue-200'>
                                  <span className='truncate'>Recommended</span>
                                </div>
                              )}
                          </div>
                          <div className='relative mt-0.5 flex items-center gap-1'>
                            {plan.name === 'Enterprise' ? (
                              <span className='text-sm font-medium text-neutral-900 dark:text-neutral-400'>
                                Custom
                              </span>
                            ) : (
                              <>
                                <NumberFlow
                                  value={plan.price[period]!}
                                  className='text-sm font-medium text-neutral-700 tabular-nums dark:text-neutral-200'
                                  format={{
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0
                                  }}
                                />
                                <span className='text-sm font-medium text-neutral-400'>
                                  per month
                                  {period === 'yearly' && ', billed yearly'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className='flex gap-3'>
                          <Button
                            type='button'
                            className='h-full w-fit rounded-lg bg-neutral-100 px-2.5 transition-colors duration-75 hover:bg-neutral-200/80 enabled:active:bg-neutral-200 disabled:opacity-30 lg:hidden'
                            disabled={mobilePlanIndex === 0}
                            onClick={() =>
                              setMobilePlanIndex(mobilePlanIndex - 1)
                            }
                          >
                            <ChevronLeft className='size-5 text-neutral-800' />
                          </Button>
                          {plan.name === 'Enterprise' && !disableCurrentPlan ? (
                            <button
                              type='button'
                              onClick={() => setContactModalOpen(true)}
                              className={cn(
                                'flex h-8 w-full cursor-pointer items-center justify-center rounded-md text-center text-sm ring-gray-200 transition-all duration-200 ease-in-out',
                                'mt-2 border border-neutral-200 bg-white text-neutral-900 shadow-sm hover:bg-neutral-50'
                              )}
                            >
                              Contact us
                            </button>
                          ) : hasActiveSubscription ? (
                            <DynamicTooltipWrapper
                              tooltipProps={
                                permissionsError && !disableCurrentPlan
                                  ? { content: permissionsError }
                                  : undefined
                              }
                            >
                              <Button
                                type='button'
                                variant='default'
                                size='lg'
                                disabled={
                                  !!permissionsError || disableCurrentPlan
                                }
                                onClick={() => setChangePlanTarget(plan)}
                                className='h-8 w-full border bg-neutral-950 shadow-sm hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-200 dark:bg-white dark:text-neutral-900'
                              >
                                {buttonLabel}
                              </Button>
                            </DynamicTooltipWrapper>
                          ) : (
                            <DynamicTooltipWrapper
                              tooltipProps={
                                permissionsError && !disableCurrentPlan
                                  ? { content: permissionsError }
                                  : undefined
                              }
                            >
                              <BetterAuthActionButton
                                action={() => handelSubscriptions(plan)}
                                variant='default'
                                size='lg'
                                showChildren={false}
                                disabled={
                                  !!permissionsError || disableCurrentPlan
                                }
                                className='h-8 w-full border bg-neutral-950 shadow-sm hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-200 dark:bg-white dark:text-neutral-900'
                              >
                                {buttonLabel}
                              </BetterAuthActionButton>
                            </DynamicTooltipWrapper>
                            // <UpgradePlanButton
                            //   plan={plan.name.toLowerCase()}
                            //   tier={planTier > 1 ? planTier : undefined}
                            //   period={period}
                            //   disabled={
                            //     disableCurrentPlan || currentPlan === "enterprise"
                            //   }
                            //   disabledTooltip={permissionsError || undefined}
                            //   text={
                            //     currentPlan === "enterprise"
                            //       ? "Contact support"
                            //       : disableCurrentPlan
                            //         ? "Current plan"
                            //         : isDowngrade
                            //           ? "Downgrade"
                            //           : "Upgrade"
                            //   }
                            //   variant={isDowngrade ? "secondary" : "primary"}
                            //   className="h-8 shadow-sm"
                            // />
                          )}
                          <Button
                            type='button'
                            className='h-full w-fit rounded-lg bg-neutral-100 px-2.5 transition-colors duration-75 hover:bg-neutral-200/80 active:bg-neutral-200 disabled:opacity-30 lg:hidden'
                            disabled={mobilePlanIndex >= plans.length - 1}
                            onClick={() =>
                              setMobilePlanIndex(mobilePlanIndex + 1)
                            }
                          >
                            <ChevronRight className='size-5 text-neutral-800' />
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* <div className='relative -z-10 bg-white dark:bg-neutral-900'>
              <div className='bg-bg-muted border-subtle absolute inset-x-0 -top-2.5 bottom-0 rounded-b-[12px] border dark:bg-neutral-100/10' />

              <AdjustUsageRow
                onLinksUsageChange={(value) => setLinksUsage(value)}
                onEventsUsageChange={(value) => setEventsUsage(value)}
              />
            </div> */}

            <div className='dark:from-card h-4 bg-linear-to-b from-white' />
          </div>
          <div className='flex flex-col pb-12'>
            {PRICING_PLAN_COMPARE_FEATURES.map((section) => (
              <BillingCompareSection
                key={section.category}
                category={section.category}
                href={section.href}
                features={section.features}
                mobilePlanIndex={mobilePlanIndex}
                plans={plans}
              />
            ))}
          </div>
        </div>
      </div>

      <EnterpriseContactModal
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
      />

      {changePlanTarget && (
        <ChangePlanConfirmationModal
          open={!!changePlanTarget}
          onOpenChange={(open) => {
            if (!open) setChangePlanTarget(null);
          }}
          plan={changePlanTarget}
          period={period}
        />
      )}
    </Card>
  );
};

function BillingCompareSection({
  category,
  href,
  features,
  mobilePlanIndex,
  plans
}: (typeof PRICING_PLAN_COMPARE_FEATURES)[number] & {
  mobilePlanIndex: number;
  plans: { plan: PlanDetails; planTier: number }[];
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  // const { defaultProgramId } = useWorkspace();

  // useEffect(() => {
  //   if (category === "Links") {
  //     // If there's a default program, collapse Links. Otherwise expand.
  //     setIsExpanded(!defaultProgramId);
  //   } else if (category === "Partners") {
  //     // If there's no default program, collapse Partners. Otherwise expand.
  //     setIsExpanded(Boolean(defaultProgramId));
  //   } else {
  //     setIsExpanded(true);
  //   }
  // }, [category, defaultProgramId]);

  const Icon = COMPARE_FEATURE_ICONS[category];

  return (
    <div className='@container w-full overflow-x-hidden'>
      <div className='flex items-center justify-between border-b border-neutral-200 dark:border-neutral-500'>
        <button
          type='button'
          className='group flex grow items-center gap-2 px-5 py-4 text-left'
          onClick={() => setIsExpanded((e) => !e)}
        >
          <Icon className='size-4 text-neutral-600 dark:text-neutral-300' />
          <h3 className='text-base font-medium text-black dark:text-neutral-300'>
            {category}
          </h3>
          <ChevronRight
            className={cn(
              'size-4 text-neutral-400 transition-[transform,color] group-hover:text-neutral-500 [&_*]:stroke-2',
              isExpanded && 'rotate-90'
            )}
          />
        </button>
        {href && (
          <Link
            href={href}
            target='_blank'
            className='mr-5 cursor-alias text-xs font-medium text-neutral-500 underline decoration-dotted underline-offset-2 dark:text-neutral-400'
          >
            Learn more ↗
          </Link>
        )}
      </div>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0 }}
        className={cn(
          'overflow-clip transition-opacity',
          !isExpanded && 'opacity-0'
        )}
        inert={!isExpanded}
      >
        <table
          className={cn(
            'grid grid-cols-4 overflow-hidden text-sm text-neutral-800 dark:text-neutral-300 [&_strong]:font-medium',

            // Mobile
            'max-lg:w-[calc(400cqw+3*32px)] max-lg:translate-x-[calc(-1*var(--index)*(100cqw+32px))] max-lg:gap-x-8 max-lg:transition-transform'
          )}
          style={
            {
              '--index': mobilePlanIndex
            } as CSSProperties
          }
        >
          <thead className='sr-only'>
            <tr>
              {plans.map(({ plan }) => (
                <th key={plan.name}>{plan.name}</th>
              ))}
            </tr>
          </thead>
          <tbody className='contents'>
            {features.map(({ check, text, href }, idx) => {
              const As = href ? 'a' : 'span';

              return (
                <tr key={idx} className='contents bg-white dark:bg-neutral-500'>
                  {plans.map(({ plan }) => {
                    const id = plan.name.toLowerCase();
                    const isChecked =
                      typeof check === 'boolean'
                        ? check
                        : check === undefined ||
                          (check[id as keyof typeof check] ??
                            check.default ??
                            false);

                    return (
                      <td
                        key={id}
                        className={cn(
                          'dark:bg-card flex items-center gap-2 border-b border-neutral-200 bg-white px-5 py-4 dark:border-neutral-500',
                          !isChecked && 'text-neutral-300 dark:text-neutral-500'
                        )}
                      >
                        {isChecked ? (
                          <Check className='size-3 text-neutral-500 dark:text-neutral-300' />
                        ) : (
                          <span className='w-3'>&bull;</span>
                        )}
                        <As
                          href={href}
                          target='_blank'
                          {...(href && {
                            className:
                              'cursor-help underline decoration-dotted underline-offset-2'
                          })}
                        >
                          {typeof text === 'function'
                            ? (text({
                                id,
                                plan
                              }) as React.ReactNode)
                            : text}
                        </As>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
