'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Check } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

export default function Hero() {
  return (
    <section className='relative overflow-hidden bg-white pt-15 pb-20 md:pt-16 md:pb-24 lg:pt-16 lg:pb-32'>
      {/* Subtle background gradient */}
      <div className='pointer-events-none absolute inset-0 bg-linear-to-b from-neutral-50 to-white' />

      {/* Decorative gradient orbs */}
      <div className='pointer-events-none absolute top-1/4 right-0 h-125 w-125 translate-x-1/2 rounded-full bg-neutral-100/50 blur-3xl' />
      <div className='pointer-events-none absolute bottom-0 left-1/4 h-75 w-75 rounded-full bg-neutral-100/30 blur-3xl' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-16'>
          {/* Left: Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className='inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-600'>
                AI-Powered Amazon Selling Suite
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='mt-6 text-4xl leading-[1.15] font-bold tracking-tight text-neutral-900 md:text-5xl lg:text-6xl'
            >
              Everything you need to{' '}
              <span className='bg-linear-to-r from-(--shibsa-brand-color) to-orange-500 bg-clip-text text-transparent'>
                sell better
              </span>{' '}
              on Amazon
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='mt-6 text-lg leading-relaxed text-neutral-500 md:text-xl'
            >
              From listing optimization to profit analytics — {APP_NAME} gives
              Amazon sellers AI-powered tools to optimize listings, track
              compliance, analyze reviews, and grow smarter.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='mt-8 flex flex-col gap-3 sm:flex-row'
            >
              <Link
                href='/auth/register'
                className='inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-neutral-800'
              >
                Get Started Free
                <ArrowRight className='h-4 w-4' />
              </Link>
              <Link
                href='/contact'
                className='inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-6 py-3 text-base font-semibold text-neutral-700 shadow-sm transition-all hover:bg-neutral-50'
              >
                Contact Us
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-500'
            >
              <span className='flex items-center gap-1.5'>
                <Check className='h-4 w-4 text-emerald-600' /> No credit card
                required
              </span>
              <span className='flex items-center gap-1.5'>
                <Check className='h-4 w-4 text-emerald-600' /> Subscription
                based
              </span>
              <span className='flex items-center gap-1.5'>
                <Check className='h-4 w-4 text-emerald-600' /> Cancel anytime
              </span>
            </motion.div>
          </div>

          {/* Right: Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='relative'
          >
            <div className='overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xl'>
              <Image
                src='/assets/avatars/hero-asset.png'
                alt='ListingMirror Dashboard'
                width={600}
                height={500}
                className='h-auto w-full object-cover'
                priority
              />
            </div>
            {/* Floating badge */}
            <div className='absolute -top-3 -right-3 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm'>
              AI-Powered
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
