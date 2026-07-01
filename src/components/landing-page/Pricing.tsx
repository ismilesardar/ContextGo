'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Check } from 'lucide-react';

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  const plans = [
    {
      name: 'Starter',
      desc: 'Perfect for solo sellers getting started.',
      priceMonthly: 49,
      priceYearly: 39, // Equivalent per month
      features: [
        'Up to 50 ASINs',
        '24/7 Monitoring',
        'Email Alerts',
        'Basic Keyword Tracking',
        '7-day Data History'
      ],
      cta: 'Start Free Trial',
      highlight: false
    },
    {
      name: 'Growth',
      desc: 'For scaling brands that need immediate alerts.',
      priceMonthly: 99,
      priceYearly: 79,
      features: [
        'Up to 250 ASINs',
        'Real-time Buy Box Alerts',
        'Slack & SMS Integration',
        'Advanced Keyword Rank Tracker',
        'Review Monitoring',
        '90-day Data History'
      ],
      cta: 'Start Free Trial',
      highlight: true
    },
    {
      name: 'Enterprise',
      desc: 'For agencies and large catalog aggregators.',
      priceMonthly: 299,
      priceYearly: 249,
      features: [
        'Unlimited ASINs',
        'API Access',
        'Custom Webhooks',
        'Dedicated Account Manager',
        'White-label Reports',
        'Unlimited Data History'
      ],
      cta: 'Contact Sales',
      highlight: false
    }
  ];

  return (
    <section id='pricing' className='bg-lp-bg relative py-24 md:py-32'>
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.015]" />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-5xl'>
            Simple, predictable pricing
          </h2>
          <p className='mb-8 text-lg text-slate-400'>
            Invest in protecting your Amazon revenue. No hidden fees or surprise
            overages.
          </p>

          <div className='flex items-center justify-center gap-4'>
            <span
              className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-slate-400'}`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className='relative inline-flex h-7 w-14 items-center rounded-full bg-white/10 transition-colors focus:outline-none'
            >
              <span className='sr-only'>Toggle billing period</span>
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-blue-600 transition duration-200 ease-in-out ${
                  isYearly ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span
              className={`flex items-center gap-2 text-sm font-medium ${isYearly ? 'text-white' : 'text-slate-400'}`}
            >
              Yearly{' '}
              <span className='rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400'>
                Save 20%
              </span>
            </span>
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative rounded-2xl p-8 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? 'border-2 border-blue-600/50 bg-[#0A0F1E] shadow-xl shadow-blue-600/10'
                  : 'border border-white/5 bg-[#0A0F1E] shadow-xl'
              }`}
            >
              {plan.highlight && (
                <div className='absolute -top-3 right-4 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase'>
                  Most Popular
                </div>
              )}

              <h3 className='mb-2 text-2xl font-bold text-white'>
                {plan.name}
              </h3>
              <p className='h-10 text-sm text-slate-400'>{plan.desc}</p>

              <div className='my-8 flex items-baseline gap-2'>
                <span className='text-5xl font-extrabold text-white'>
                  ${isYearly ? plan.priceYearly : plan.priceMonthly}
                </span>
                <span className='text-slate-400'>/ mo</span>
              </div>

              <div className='mb-8 text-sm text-slate-400'>
                {isYearly
                  ? `Billed annually ($${plan.priceYearly * 12}/year)`
                  : 'Billed monthly'}
              </div>

              <Link
                href='#signup'
                className={`mb-8 flex w-full items-center justify-center rounded-xl py-4 font-bold transition-all ${
                  plan.highlight
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-500'
                    : 'border border-white/10 bg-white/5 text-white hover:bg-white/10'
                }`}
              >
                {plan.cta}
              </Link>

              <ul className='space-y-4 text-[13px]'>
                {plan.features.map((feature, fIdx) => (
                  <li
                    key={fIdx}
                    className='flex items-center gap-3 text-slate-400'
                  >
                    <Check className='h-4 w-4 shrink-0 text-blue-500' />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
