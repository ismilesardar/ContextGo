'use client';

import { motion } from 'motion/react';
import Image from 'next/image';

export default function ProductScreenshots() {
  return (
    <section className='bg-lp-bg overflow-hidden border-y border-white/5 py-24 md:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-5xl'>
            See it in action
          </h2>
          <p className='text-lg text-slate-400'>
            A clean, intuitive interface designed for speed. No clutter, just
            the insights you need to win the Buy Box.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className='bg-lp-card/50 relative mx-auto overflow-hidden rounded-2xl border border-white/10 p-4 shadow-[0_0_80px_rgba(59,130,246,0.15)] backdrop-blur-sm'
        >
          <div className='via-lp-accent/50 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent' />
          <div className='flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#0D1326]'>
            {/* Header Navbar */}
            <div className='flex h-14 items-center justify-between border-b border-white/5 px-6'>
              <div className='flex items-center gap-6'>
                <div className='from-lp-accent/80 to-lp-highlight/80 h-8 w-8 rounded-lg bg-gradient-to-br' />
                <div className='hidden gap-4 md:flex'>
                  <div className='h-4 w-16 rounded bg-white/10' />
                  <div className='h-4 w-20 rounded bg-white/5' />
                  <div className='h-4 w-24 rounded bg-white/5' />
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <div className='h-6 w-6 rounded-full bg-white/10' />
                <div className='h-8 w-8 rounded-full bg-white/20' />
              </div>
            </div>

            {/* Dashboard Area */}
            <div className='flex flex-col gap-8 p-6 md:p-8 lg:flex-row'>
              {/* ASIN List */}
              <div className='flex-1 space-y-4'>
                <div className='mb-6 h-6 w-32 rounded bg-white/10' />
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <div
                    key={i}
                    className={`h-16 rounded-lg border ${i === 1 ? 'border-lp-accent/30 bg-lp-accent/5' : 'border-white/5 bg-white/[0.02]'} flex items-center gap-4 p-4`}
                  >
                    <div className='h-10 w-10 rounded bg-white/10' />
                    <div className='flex-1'>
                      <div className='mb-2 h-3 w-1/2 rounded bg-white/20' />
                      <div className='h-2 w-1/4 rounded bg-white/10' />
                    </div>
                    {i === 1 && (
                      <div className='rounded-full border border-rose-500/30 bg-rose-500/20 px-3 py-1 text-xs text-rose-400'>
                        Buy Box Lost
                      </div>
                    )}
                    {i !== 1 && (
                      <div className='rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400'>
                        Stable
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Detail Panel */}
              <div className='relative flex-1 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-6 lg:max-w-md'>
                <div className='absolute top-0 right-0 h-32 w-32 rounded-full bg-rose-500/10 blur-3xl' />
                <div className='mb-6 flex h-48 items-end gap-2 rounded-lg border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-4'>
                  {/* Chart placeholder */}
                  {[40, 60, 45, 80, 50, 40, 30, 20].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-sm transition-all ${i > 4 ? 'bg-rose-500/50' : 'bg-lp-accent/50'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <h3 className='mb-4 font-medium text-white'>
                  Competitor Activity
                </h3>
                <div className='space-y-3'>
                  <div className='flex h-10 items-center justify-between rounded border border-rose-500/20 bg-rose-500/10 px-4'>
                    <div className='h-3 w-24 rounded bg-rose-500/50' />
                    <div className='h-3 w-12 rounded bg-white/20' />
                  </div>
                  <div className='flex h-10 items-center justify-between rounded bg-white/5 px-4'>
                    <div className='h-3 w-32 rounded bg-white/20' />
                    <div className='h-3 w-10 rounded bg-white/10' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
