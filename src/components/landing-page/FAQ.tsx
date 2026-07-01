'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need a Seller Central developer account to use this?',
      a: 'No! ListingPulse can run purely by tracking public ASIN data. However, connecting your Seller Central account via our authorized app enables deeper insights like exact suppression reasons and deeper inventory numbers.'
    },
    {
      q: 'How fast do alerts arrive?',
      a: 'Depending on the event, alerts are near real-time. Buy Box losses and critical price changes are typically caught within 1-5 minutes and pushed immediately to your Slack or Email.'
    },
    {
      q: 'Can I monitor competitor ASINs?',
      a: 'Absolutely. You can add any public ASIN to your dashboard to monitor their pricing strategy, BSR changes, and stock levels.'
    },
    {
      q: 'Will this affect my Amazon API rate limits?',
      a: 'No. Our proprietary scraping and API rotation architecture ensures your own Seller Central API limits are never impacted.'
    },
    {
      q: 'Do you offer a free trial?',
      a: 'Yes, we offer a 14-day free trial on Starter and Growth plans. No credit card is required to start.'
    },
    {
      q: 'Can I add my agency clients?',
      a: 'Yes, the Growth and Enterprise plans allow you to organize ASINs by client folders, set distinct reporting, and invite team members with restricted read-only views.'
    }
  ];

  return (
    <section
      id='faq'
      className='bg-lp-card border-t border-white/5 py-24 md:py-32'
    >
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <h2 className='mb-4 text-3xl font-bold text-white md:text-4xl'>
            Frequently Asked Questions
          </h2>
          <p className='text-slate-400'>
            Everything you need to know about ListingPulse.
          </p>
        </div>

        <div className='space-y-4'>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className='bg-lp-bg overflow-hidden rounded-2xl border border-white/10'
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className='flex w-full items-center justify-between px-6 py-5 text-left focus:outline-none'
              >
                <span className='text-lg font-medium text-white'>{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className='px-6 pb-5 leading-relaxed text-slate-400'>
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
