'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

export default function CTA() {
  return (
    <section className='bg-neutral-900 py-20 md:py-28'>
      <div className='mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-3xl font-bold tracking-tight text-white md:text-4xl'
        >
          Start optimizing your Amazon listings today
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className='mt-4 text-lg text-neutral-400'
        >
          Join sellers who use {APP_NAME} to analyze, comply, and grow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className='mt-8'
        >
          <Link
            href='/auth/register'
            className='inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-neutral-900 shadow-sm transition-all hover:bg-neutral-100'
          >
            Get Started Free
            <ArrowRight className='h-4 w-4' />
          </Link>
          <p className='mt-4 text-sm text-neutral-500'>
            No credit card required &middot; Subscription based &middot; Start
            anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
