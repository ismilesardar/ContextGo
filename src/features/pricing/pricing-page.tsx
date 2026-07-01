'use client';

import { useState, CSSProperties } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';
import { PLANS } from '@/utils/constants/pricing/pricing-plans';
import { PRICING_PLAN_COMPARE_FEATURES } from '@/utils/constants/pricing/pricing-plan-compare-features';
import {
  ChartLine,
  FileText,
  Image,
  MessageCircleQuestion,
  Plug2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users2,
  type LucideIcon
} from 'lucide-react';
import { INFINITY_NUMBER } from '@/utils/functions/misc';
import { nFormatter } from '@/utils/functions/nformatter';
import { Navbar, Footer } from '@/components/landing-page';
import { APP_NAME } from '@/config/url.config';

const COMPARE_FEATURE_ICONS: Record<
  (typeof PRICING_PLAN_COMPARE_FEATURES)[number]['category'],
  LucideIcon
> = {
  Analytics: ChartLine,
  Compliance: ShieldCheck,
  'Listing Content': FileText,
  'Advertising & Growth': TrendingUp,
  'Image Tools': Image,
  'AI Features': Sparkles,
  'Team & Workspace': Users2,
  'API & Integrations': Plug2,
  Support: MessageCircleQuestion
};

const FAQ_ITEMS = [
  {
    q: 'Is there a free plan?',
    a: `Yes! Our Free plan includes 100 system tokens and 2 workspaces, so you can try ${APP_NAME} before committing to a paid plan.`
  },
  {
    q: 'Can I switch plans later?',
    a: 'Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access to new features. When downgrading, changes apply at the end of your billing cycle.'
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards and debit cards. Payments are processed securely through Stripe.'
  },
  {
    q: 'Is there a free plan available?',
    a: 'Yes! Our Free plan includes 100 system tokens and 2 workspaces. You can use it indefinitely and upgrade to a paid plan whenever you need more.'
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'You can cancel anytime from your billing settings. Your access continues until the end of the current billing period.'
  },
  {
    q: 'What are AI credits?',
    a: `AI credits are shared across all ${APP_NAME} tools — SEO, Content, Compliance, Analytics, and more. Each action (analysis, generation, check) consumes a small number of credits based on complexity.`
  }
];

export function PricingPage() {
  const [period, setPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [mobilePlanIndex, setMobilePlanIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Plans for pricing cards: all 5
  const displayPlans = PLANS.filter((p) =>
    ['Pro', 'Business', 'Advanced', 'Enterprise'].includes(p.name)
  );
  // Plans for comparison table: paid only, Free shown separately at bottom
  const tablePlans = PLANS.filter((p) =>
    ['Pro', 'Business', 'Advanced', 'Enterprise'].includes(p.name)
  );

  return (
    <div className='h-screen overflow-y-auto bg-white'>
      <Navbar />

      <div className='mt-20 h-[calc(100%-5rem)] overflow-y-auto'>
        <main className='pt-24 pb-20 md:pt-10 md:pb-28'>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            {/* Header */}
            <div className='mx-auto mb-12 max-w-3xl text-center'>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl'
              >
                Simple, transparent pricing
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='mt-4 text-lg text-neutral-500'
              >
                Start free, upgrade as you grow. No hidden fees.
              </motion.p>

              {/* Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className='mt-8 inline-flex items-center gap-3'
              >
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    period === 'monthly'
                      ? 'text-neutral-900'
                      : 'text-neutral-400'
                  )}
                >
                  Monthly
                </span>
                <button
                  onClick={() =>
                    setPeriod(period === 'monthly' ? 'yearly' : 'monthly')
                  }
                  className='relative inline-flex h-7 w-14 items-center rounded-full bg-neutral-200 transition-colors'
                >
                  <span
                    className={cn(
                      'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200',
                      period === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                    )}
                  />
                </button>
                <span
                  className={cn(
                    'flex items-center gap-2 text-sm font-medium',
                    period === 'yearly'
                      ? 'text-neutral-900'
                      : 'text-neutral-400'
                  )}
                >
                  Yearly
                  <span className='rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700'>
                    Save ~20%
                  </span>
                </span>
              </motion.div>
            </div>

            {/* Plan Cards */}
            <div className='relative mb-16'>
              <div className='grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-neutral-200 bg-neutral-200 shadow-sm max-lg:hidden'>
                {displayPlans.map((plan) => (
                  <div key={plan.name} className='flex flex-col bg-white p-6'>
                    <div className='mb-1 flex items-start justify-between gap-2'>
                      <h3 className='text-base font-semibold text-neutral-900'>
                        {plan.name}
                      </h3>
                      {plan.name === 'Business' && (
                        <span className='rounded-md border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600'>
                          Popular
                        </span>
                      )}
                    </div>

                    <div className='mt-2'>
                      {plan.price[period] === null ? (
                        <span className='text-2xl font-bold text-neutral-900'>
                          Custom
                        </span>
                      ) : (
                        <div className='flex items-baseline gap-1'>
                          <NumberFlow
                            value={plan.price[period]!}
                            className='text-3xl font-bold text-neutral-900'
                            format={{
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0
                            }}
                          />
                          <span className='text-sm text-neutral-400'>/mo</span>
                        </div>
                      )}
                      {period === 'yearly' && plan.price.yearly && (
                        <p className='mt-0.5 text-xs text-neutral-400'>
                          ${plan.price.yearly * 12} billed annually
                        </p>
                      )}
                    </div>

                    <div className='mt-4'>
                      {plan.name === 'Free' ? (
                        <Link
                          href='/auth/register'
                          className='flex h-9 w-full items-center justify-center rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-50'
                        >
                          Get Started
                        </Link>
                      ) : (
                        <Link
                          href='/auth/register'
                          className='flex h-9 w-full items-center justify-center rounded-lg bg-neutral-900 text-sm font-medium text-white transition-all hover:bg-neutral-800'
                        >
                          Get Started
                        </Link>
                      )}
                    </div>

                    <div className='mt-4 space-y-2.5 border-t border-neutral-100 pt-4'>
                      {plan.limits && (
                        <div className='text-xs text-neutral-500'>
                          <span className='font-medium text-neutral-700'>
                            {plan.limits.systemToken === INFINITY_NUMBER
                              ? 'Unlimited'
                              : nFormatter(plan.limits.systemToken)}
                          </span>{' '}
                          AI credits/mo
                          <br />
                          <span className='font-medium text-neutral-700'>
                            {plan.limits.imageToken === INFINITY_NUMBER
                              ? 'Unlimited'
                              : nFormatter(plan.limits.imageToken)}
                          </span>{' '}
                          image credits/mo
                          <br />
                          <span className='font-medium text-neutral-700'>
                            {plan.limits.users === INFINITY_NUMBER
                              ? 'Unlimited'
                              : plan.limits.users}
                          </span>{' '}
                          team members
                          <br />
                          <span className='font-medium text-neutral-700'>
                            {plan.limits.workspaces === INFINITY_NUMBER
                              ? 'Unlimited'
                              : plan.limits.workspaces}
                          </span>{' '}
                          workspaces
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile: Carousel */}
              <div className='lg:hidden'>
                <div className='scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4'>
                  {displayPlans.map((plan, idx) => (
                    <div
                      key={plan.name}
                      className='min-w-[280px] flex-shrink-0 snap-center rounded-xl border border-neutral-200 bg-white p-6 shadow-sm'
                    >
                      <div className='mb-1 flex items-start justify-between gap-2'>
                        <h3 className='text-base font-semibold text-neutral-900'>
                          {plan.name}
                        </h3>
                        {plan.name === 'Business' && (
                          <span className='rounded-md border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-600'>
                            Popular
                          </span>
                        )}
                      </div>

                      <div className='mt-2'>
                        {plan.price[period] === null ? (
                          <span className='text-2xl font-bold text-neutral-900'>
                            Custom
                          </span>
                        ) : (
                          <div className='flex items-baseline gap-1'>
                            <NumberFlow
                              value={plan.price[period]!}
                              className='text-3xl font-bold text-neutral-900'
                              format={{
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 0
                              }}
                            />
                            <span className='text-sm text-neutral-400'>
                              /mo
                            </span>
                          </div>
                        )}
                      </div>

                      <div className='mt-4'>
                        <Link
                          href='/auth/register'
                          className={cn(
                            'flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium transition-all',
                            plan.name === 'Free'
                              ? 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                              : 'bg-neutral-900 text-white hover:bg-neutral-800'
                          )}
                        >
                          Get Started
                        </Link>
                      </div>

                      <div className='mt-4 space-y-2.5 border-t border-neutral-100 pt-4'>
                        <div className='text-xs text-neutral-500'>
                          <span className='font-medium text-neutral-700'>
                            {plan.limits.systemToken === INFINITY_NUMBER
                              ? 'Unlimited'
                              : nFormatter(plan.limits.systemToken)}
                          </span>{' '}
                          AI credits/mo
                          <br />
                          <span className='font-medium text-neutral-700'>
                            {plan.limits.imageToken === INFINITY_NUMBER
                              ? 'Unlimited'
                              : nFormatter(plan.limits.imageToken)}
                          </span>{' '}
                          image credits/mo
                          <br />
                          <span className='font-medium text-neutral-700'>
                            {plan.limits.users === INFINITY_NUMBER
                              ? 'Unlimited'
                              : plan.limits.users}
                          </span>{' '}
                          team members
                          <br />
                          <span className='font-medium text-neutral-700'>
                            {plan.limits.workspaces === INFINITY_NUMBER
                              ? 'Unlimited'
                              : plan.limits.workspaces}
                          </span>{' '}
                          workspaces
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enterprise CTA */}
            <div className='mb-16 rounded-lg border border-neutral-200 bg-neutral-50 p-6 text-center'>
              <h3 className='text-lg font-semibold text-neutral-900'>
                Need Enterprise?
              </h3>
              <p className='mt-1 text-sm text-neutral-500'>
                Custom pricing, dedicated support, unlimited everything.{' '}
                <Link
                  href='/contact'
                  className='font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700'
                >
                  Contact us
                </Link>
              </p>
            </div>

            {/* Feature Comparison Table */}
            <div className='mb-16'>
              <h2 className='mb-8 text-2xl font-bold text-neutral-900'>
                Compare features
              </h2>
              <div className='overflow-hidden rounded-xl border border-neutral-200'>
                {PRICING_PLAN_COMPARE_FEATURES.map((section) => {
                  const Icon =
                    COMPARE_FEATURE_ICONS[
                      section.category as keyof typeof COMPARE_FEATURE_ICONS
                    ] || FileText;

                  return (
                    <div
                      key={section.category}
                      className='border-b border-neutral-100 last:border-b-0'
                    >
                      <div className='flex items-center gap-2 border-b border-neutral-100 bg-neutral-50 px-5 py-3'>
                        <Icon className='h-4 w-4 text-neutral-500' />
                        <h3 className='text-sm font-medium text-neutral-700'>
                          {section.category}
                        </h3>
                      </div>

                      {section.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className='grid grid-cols-4 gap-px bg-neutral-100 max-lg:hidden'
                        >
                          {tablePlans.map((plan) => {
                            const planId = plan.name.toLowerCase();
                            const isChecked =
                              typeof feature.check === 'boolean'
                                ? feature.check
                                : feature.check === undefined ||
                                  (feature.check[
                                    planId as keyof typeof feature.check
                                  ] ??
                                    feature.check.default ??
                                    false);

                            return (
                              <div
                                key={plan.name}
                                className={cn(
                                  'flex items-center gap-2 bg-white px-5 py-3 text-sm',
                                  !isChecked && 'text-neutral-300'
                                )}
                              >
                                {isChecked ? (
                                  <Check className='h-3.5 w-3.5 shrink-0 text-neutral-500' />
                                ) : (
                                  <span className='w-3.5 shrink-0 text-center text-neutral-300'>
                                    &ndash;
                                  </span>
                                )}
                                <span className='text-xs leading-relaxed text-neutral-600'>
                                  {typeof feature.text === 'function'
                                    ? feature.text({
                                        id: planId,
                                        plan: plan as any
                                      })
                                    : feature.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })}

                {/* Free Plan Row — shown separately at the bottom */}
                <div className='border-t-2 border-neutral-300 bg-neutral-50 max-lg:hidden'>
                  <div className='flex items-center gap-2 border-b border-neutral-200 px-5 py-3'>
                    <h3 className='text-sm font-medium text-neutral-700'>
                      Free Plan
                    </h3>
                  </div>
                  <div className='bg-neutral-50 px-5 py-4 text-xs leading-relaxed text-neutral-500'>
                    <span className='font-medium text-neutral-700'>100</span> AI
                    credits/mo &middot;{' '}
                    <span className='font-medium text-neutral-700'>0</span>{' '}
                    image credits/mo &middot;{' '}
                    <span className='font-medium text-neutral-700'>0</span> team
                    members &middot;{' '}
                    <span className='font-medium text-neutral-700'>2</span>{' '}
                    workspaces &middot;{' '}
                    <span className='font-medium text-neutral-700'>
                      Basic support (email)
                    </span>
                  </div>
                </div>

                {/* Mobile: feature list without grid */}
                <div className='p-4 text-sm text-neutral-500 lg:hidden'>
                  <p className='text-center'>
                    View the full comparison on a larger screen or{' '}
                    <Link
                      href='/auth/register'
                      className='font-medium text-neutral-900 underline'
                    >
                      sign up free
                    </Link>{' '}
                    to explore all features.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className='mb-8 text-2xl font-bold text-neutral-900'>
                Frequently asked questions
              </h2>
              <div className='space-y-3'>
                {FAQ_ITEMS.map((faq, idx) => (
                  <div
                    key={idx}
                    className='overflow-hidden rounded-lg border border-neutral-200'
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className='flex w-full items-center justify-between px-5 py-4 text-left'
                    >
                      <span className='text-sm font-medium text-neutral-900'>
                        {faq.q}
                      </span>
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200',
                          openFaq === idx && 'rotate-90'
                        )}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className='border-t border-neutral-100 px-5 py-4 text-sm leading-relaxed text-neutral-500'>
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
