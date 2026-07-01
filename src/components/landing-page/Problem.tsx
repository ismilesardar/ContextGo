'use client';

import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRightLeft,
  Clock,
  SearchX,
  ShoppingCart,
  TrendingDown
} from 'lucide-react';

export default function Problem() {
  const problems = [
    {
      icon: <ShoppingCart className='h-6 w-6 text-rose-400' />,
      title: 'Losing the Buy Box',
      desc: 'Competitors hijack your listing or undercut your price, stealing your sales overnight while you sleep.'
    },
    {
      icon: <TrendingDown className='h-6 w-6 text-rose-400' />,
      title: 'Rankings Drop Unexpectedly',
      desc: 'Algorithm changes or bad reviews tank your BSR, but you only notice when revenue dips.'
    },
    {
      icon: <SearchX className='h-6 w-6 text-rose-400' />,
      title: 'Listing Suppressions',
      desc: 'Amazon randomly suppresses your listing due to minor policy flags, pausing all your momentum.'
    }
  ];

  return (
    <section className='bg-lp-bg py-24 md:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-5xl'>
            Amazon moves fast. <br />
            <span className='text-slate-400'>Manual tracking is dead.</span>
          </h2>
          <p className='text-lg text-slate-400'>
            If you&apos;re still using spreadsheets or checking Amazon manually
            multiple times a day, you&apos;re leaving money on the table.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className='bg-lp-card/50 border border-white/5 p-8 transition-colors hover:bg-white/[0.02]'
            >
              <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10'>
                {problem.icon}
              </div>
              <h3 className='mb-3 text-xl font-bold text-white'>
                {problem.title}
              </h3>
              <p className='leading-relaxed text-slate-400'>{problem.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
