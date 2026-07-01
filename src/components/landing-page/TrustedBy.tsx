'use client';

import { motion } from 'motion/react';
import NumberFlow from '@number-flow/react';

export default function TrustedBy() {
  const stats = [
    { label: 'Active Sellers', value: 10000, suffix: '+' },
    { label: 'AI Analyses Run', value: 500000, suffix: '+' },
    { label: 'Reviews Analyzed', value: 2500000, suffix: '+' },
    { label: 'Listings Optimized', value: 150000, suffix: '+' }
  ];

  return (
    <section className='border-y border-neutral-100 bg-neutral-50 py-16 md:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <p className='mb-10 text-center text-xs font-semibold tracking-widest text-neutral-400 uppercase'>
          Trusted by Amazon Sellers Worldwide
        </p>

        <div className='grid grid-cols-2 gap-8 md:grid-cols-4'>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='text-center'
            >
              <NumberFlow
                value={stat.value}
                className='text-3xl font-bold text-neutral-900 md:text-4xl'
                format={{ notation: 'compact' }}
                suffix={stat.suffix}
              />
              <div className='mt-1.5 text-sm text-neutral-500'>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
