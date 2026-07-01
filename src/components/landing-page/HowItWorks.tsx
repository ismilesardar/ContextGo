'use client';

import { motion } from 'motion/react';
import { Upload, Zap, TrendingUp } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

const STEPS = [
  {
    icon: Upload,
    title: 'Add your product details',
    desc: 'Enter your product information — titles, descriptions, images, and keywords. Everything is manually inputted for full control.'
  },
  {
    icon: Zap,
    title: 'AI analyzes everything',
    desc: `${APP_NAME} scans your titles, descriptions, and images in one place.`
  },
  {
    icon: TrendingUp,
    title: 'Get actionable insights',
    desc: 'Receive AI-powered suggestions to optimize your listings and grow your sales.'
  }
];

export default function HowItWorks() {
  return (
    <section
      id='how-it-works'
      className='border-y border-neutral-100 bg-neutral-50 py-20 md:py-28'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl'
          >
            How it works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='mt-4 text-lg text-neutral-500'
          >
            Three simple steps to start optimizing your Amazon business.
          </motion.p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className='relative rounded-xl border border-neutral-200 bg-white p-8 shadow-sm'
              >
                <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-white'>
                  <Icon className='h-6 w-6 text-neutral-700' />
                </div>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white'>
                    {idx + 1}
                  </span>
                </div>
                <h3 className='mb-2 text-lg font-semibold text-neutral-900'>
                  {step.title}
                </h3>
                <p className='text-sm leading-relaxed text-neutral-500'>
                  {step.desc}
                </p>

                {/* Connector */}
                {idx < STEPS.length - 1 && (
                  <div className='absolute top-1/2 -right-4 hidden h-px w-8 bg-neutral-200 md:block' />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
