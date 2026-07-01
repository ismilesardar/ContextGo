'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Bot, Sparkles, ArrowRight } from 'lucide-react';
import { Navbar, Footer } from '@/components/landing-page';
import { APP_NAME } from '@/config/url.config';

const MILESTONES = [
  {
    year: '2024',
    event: `${APP_NAME} founded with a mission to simplify Amazon selling with AI`
  },
  {
    year: '2024 Q3',
    event: 'Launched our first wave of AI-powered listing tools'
  },
  {
    year: '2025 Q1',
    event: 'Expanded into analytics and review insights'
  },
  {
    year: '2025 Q3',
    event: 'Added AI content generation tools'
  },
  {
    year: '2026',
    event: 'Continued investing in AI to help sellers grow'
  }
];

const VALUES = [
  {
    icon: Bot,
    title: 'AI-First Approach',
    desc: 'We believe AI should make complex tasks simple. Every tool is built with intelligent automation at its core.'
  },
  {
    icon: Shield,
    title: 'Seller-Centric',
    desc: 'Every feature we build starts with a real Amazon seller problem. We eat our own dogfood.'
  },
  {
    icon: Sparkles,
    title: 'Continuous Innovation',
    desc: 'The Amazon marketplace evolves fast — we ship updates continuously to keep you ahead.'
  }
];

export function AboutView() {
  return (
    <div className='h-screen bg-white'>
      <Navbar />

      <div className='mt-20 h-[calc(100%-5rem)] overflow-y-auto'>
        {/* Hero */}
        <section className='relative overflow-hidden bg-white pt-28 pb-16 md:pt-36 md:pb-24'>
          <div className='pointer-events-none absolute inset-0 bg-linear-to-b from-neutral-50 to-white' />
          <div className='relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className='inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600'>
                About Us
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='mt-6 text-4xl font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl'
            >
              AI-powered tools built{' '}
              <span className='bg-linear-to-r from-[var(--shibsa-brand-color)] to-orange-500 bg-clip-text text-transparent'>
                for Amazon sellers
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500'
            >
              {APP_NAME} is a complete suite of AI-powered tools that help
              Amazon sellers optimize listings and grow their business — all
              from one dashboard.
            </motion.p>
          </div>
        </section>

        {/* Mission */}
        <section className='border-y border-neutral-100 bg-neutral-50 py-20'>
          <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
            <div className='grid items-center gap-12 lg:grid-cols-2'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className='text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl'>
                  Why we built {APP_NAME}
                </h2>
                <p className='mt-4 leading-relaxed text-neutral-500'>
                  Selling on Amazon is incredibly competitive. A single mistake
                  on a listing can cost thousands in lost revenue.
                </p>
                <p className='mt-4 leading-relaxed text-neutral-500'>
                  We built {APP_NAME} to give sellers a single command center
                  where AI handles the heavy lifting.
                </p>
                <p className='mt-4 leading-relaxed text-neutral-500'>
                  No more jumping between spreadsheets, tools, and browser tabs.
                  Everything you need is in one place.
                </p>
                <Link
                  href='/auth/register'
                  className='mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800'
                >
                  Get Started Free
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className='grid grid-cols-2 gap-4'
              >
                {[
                  { label: 'AI Analyses', value: '500K+' },
                  { label: 'Active Sellers', value: '10K+' },
                  { label: 'Listings Optimized', value: '150K+' },
                  { label: 'Uptime', value: '99.9%' }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className='rounded-xl border border-neutral-200 bg-white p-5 text-center'
                  >
                    <div className='text-2xl font-bold text-neutral-900'>
                      {stat.value}
                    </div>
                    <div className='mt-1 text-sm text-neutral-500'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className='py-20'>
          <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-12 text-center'>
              <h2 className='text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl'>
                Our values
              </h2>
            </div>
            <div className='grid gap-6 md:grid-cols-3'>
              {VALUES.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className='rounded-xl border border-neutral-200 bg-white p-6'
                  >
                    <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50'>
                      <Icon className='h-5 w-5 text-neutral-600' />
                    </div>
                    <h3 className='text-lg font-semibold text-neutral-900'>
                      {value.title}
                    </h3>
                    <p className='mt-2 text-sm leading-relaxed text-neutral-500'>
                      {value.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline / Milestones */}
        <section className='border-y border-neutral-100 bg-neutral-50 py-20'>
          <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-12 text-center'>
              <h2 className='text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl'>
                Our journey
              </h2>
            </div>
            <div className='relative space-y-8 pl-8 before:absolute before:top-2 before:left-3 before:h-[90%] before:w-px before:bg-neutral-300'>
              {MILESTONES.map((m, idx) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className='relative'
                >
                  <div className='absolute top-1.5 -left-[26px] h-5 w-5 rounded-full border-2 border-[var(--shibsa-brand-color)] bg-white' />
                  <span className='text-xs font-semibold text-[var(--shibsa-brand-color)]'>
                    {m.year}
                  </span>
                  <p className='mt-1 text-sm text-neutral-600'>{m.event}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className='py-20'>
          <div className='mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
            <h2 className='text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl'>
              Ready to transform your Amazon business?
            </h2>
            <p className='mt-4 text-lg text-neutral-500'>
              Join thousands of sellers using {APP_NAME} to sell smarter.
            </p>
            <Link
              href='/auth/register'
              className='mt-8 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-neutral-800'
            >
              Get Started Free
              <ArrowRight className='h-4 w-4' />
            </Link>
            <p className='mt-4 text-sm text-neutral-400'>
              No credit card required &middot; Subscription based
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
