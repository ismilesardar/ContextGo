'use client';

import { motion } from 'motion/react';
import { Bell, Eye, ShieldCheck, Zap, TrendingDown } from 'lucide-react';
import Image from 'next/image';

export default function Solution() {
  return (
    <section className='bg-lp-card overflow-hidden border-y border-white/5 py-24 md:py-32'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-16 lg:grid-cols-2'>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='mb-6 text-3xl leading-tight font-bold text-white md:text-5xl'>
              A command center for your <br />
              <span className='from-lp-highlight bg-gradient-to-r to-purple-400 bg-clip-text text-transparent'>
                entire catalog.
              </span>
            </h2>
            <p className='mb-8 text-lg leading-relaxed text-slate-400'>
              ListingPulse acts as your automated sentry. It scans your complete
              Amazon product catalog 24/7, catching anomalies and structural
              changes before they impact your bottom line.
            </p>

            <ul className='space-y-6'>
              {[
                {
                  title: 'Real-time Alerts',
                  desc: 'Get notified via Slack, Email, or SMS the exact minute critical changes occur.',
                  icon: <Bell className='text-lp-accent h-5 w-5' />
                },
                {
                  title: 'Automated Buy Box Protection',
                  desc: 'Track hijacker movement and price warfare with historical visual data.',
                  icon: <ShieldCheck className='h-5 w-5 text-emerald-400' />
                },
                {
                  title: 'Deep Listing Audits',
                  desc: 'Ensure no unauthorized changes to titles, bullets, or images go unnoticed.',
                  icon: <Eye className='h-5 w-5 text-purple-400' />
                }
              ].map((item, i) => (
                <li key={i} className='flex gap-4'>
                  <div className='flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5'>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className='mb-1 font-semibold text-white'>
                      {item.title}
                    </h4>
                    <p className='text-sm text-slate-400'>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative'
          >
            {/* Abstract visual representations of alerts / monitoring */}
            <div className='bg-lp-highlight/20 pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]' />

            <div className='relative space-y-4'>
              {/* Alert Card 1 */}
              <div className='flex translate-x-4 items-center gap-4 rounded-xl border border-white/10 bg-[#0D1326] p-4 shadow-2xl'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/20'>
                  <Bell className='h-5 w-5 text-rose-500' />
                </div>
                <div>
                  <div className='text-sm font-semibold text-white'>
                    Buy Box Lost
                  </div>
                  <div className='text-xs text-slate-400'>
                    ASIN B08X12345 • 2 mins ago
                  </div>
                </div>
              </div>

              {/* Alert Card 2 */}
              <div className='relative z-10 flex -translate-x-4 items-center gap-4 rounded-xl border border-white/10 bg-[#0D1326] p-4 shadow-2xl'>
                <div className='bg-lp-accent/20 flex h-10 w-10 items-center justify-center rounded-full'>
                  <TrendingDown className='text-lp-accent h-5 w-5' />
                </div>
                <div>
                  <div className='text-sm font-semibold text-white'>
                    Price Dropped by Hijacker
                  </div>
                  <div className='text-xs text-slate-400'>
                    ASIN B09Y98765 • Competitor underpriced by $1.50
                  </div>
                </div>
              </div>

              {/* Alert Card 3 */}
              <div className='flex translate-x-8 items-center gap-4 rounded-xl border border-white/10 bg-[#0D1326] p-4 shadow-2xl'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20'>
                  <ShieldCheck className='h-5 w-5 text-emerald-500' />
                </div>
                <div>
                  <div className='text-sm font-semibold text-white'>
                    Suppression Resolved
                  </div>
                  <div className='text-xs text-slate-400'>
                    ASIN B07Z54321 • Listing active again
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
