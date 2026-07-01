'use client';

import { motion } from 'motion/react';
import { Briefcase, Code, Store } from 'lucide-react';

export default function UseCases() {
  const cases = [
    {
      icon: <Store className='h-6 w-6 text-emerald-400' />,
      title: 'Amazon Sellers',
      desc: 'Protect your personal cash cow. Stop hijacker bleeding and optimize pricing automatically to defend your margins while you sleep.'
    },
    {
      icon: <Briefcase className='text-lp-accent h-6 w-6' />,
      title: 'E-commerce Agencies',
      desc: 'Manage multiple client catalogs from one dashboard. Provide white-labeled reporting and prove to clients you are guarding their rankings 24/7.'
    },
    {
      icon: <Code className='h-6 w-6 text-purple-400' />,
      title: 'Brand Aggregators & Devs',
      desc: 'Monitor thousands of ASINs via API. Ingest cleanly formatted JSON webhooks directly into your internal data warehouses or tools.'
    }
  ];

  return (
    <section className='bg-lp-card border-y border-white/5 py-24 md:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <h2 className='mb-6 text-3xl font-bold text-white md:text-5xl'>
            Built for scale
          </h2>
          <p className='text-lg text-slate-400'>
            Whether you run one hero product or manage an enterprise portfolio,
            ListingPulse adapts to your workflow.
          </p>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {cases.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className='bg-lp-bg flex flex-col items-center border border-white/5 p-8 text-center transition-colors hover:border-white/20'
            >
              <div className='mb-6 flex h-14 w-14 items-center justify-center bg-white/5'>
                {item.icon}
              </div>
              <h3 className='mb-3 text-xl font-bold text-white'>
                {item.title}
              </h3>
              <p className='text-sm leading-relaxed text-slate-400'>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
