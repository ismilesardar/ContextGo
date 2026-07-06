'use client';

import { motion } from 'motion/react';
import NumberFlow from '@number-flow/react';

export default function TrustedBy() {
  const stats: {
    label: string;
    value?: number;
    suffix?: string;
    display?: string;
  }[] = [
    { label: 'Resource types', value: 6, suffix: '' },
    { label: 'MCP-compatible AI clients', display: '∞' },
    { label: 'Integration surfaces', value: 2, suffix: '' },
    { label: 'Isolated per project', value: 100, suffix: '%' }
  ];

  return (
    <section className='border-border bg-muted/30 border-y py-16 md:py-20'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <p className='text-muted-foreground mb-10 text-center text-xs font-semibold tracking-widest uppercase'>
          Built for how AI-powered teams actually work
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
              {stat.display ? (
                <div className='text-foreground text-3xl font-bold md:text-4xl'>
                  {stat.display}
                </div>
              ) : (
                <NumberFlow
                  value={stat.value ?? 0}
                  className='text-foreground text-3xl font-bold md:text-4xl'
                  suffix={stat.suffix}
                />
              )}
              <div className='text-muted-foreground mt-1.5 text-sm'>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
