'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

const TESTIMONIALS = [
  {
    quote: `${APP_NAME} caught an issue on our top listing before Amazon flagged it, and improved our click-through rate by 35%.`,
    author: 'Sarah Jenkins',
    role: 'Operations Manager, VitalCore',
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  {
    quote: `Managing 500+ ASINs was chaos. Now ${APP_NAME} is our Amazon command center.`,
    author: 'David Chen',
    role: 'CEO, Elevate Ecom',
    avatar: 'https://picsum.photos/seed/david/100/100'
  },
  {
    quote: `${APP_NAME} showed us exactly what was going wrong with our listings. We fixed the issues and saw a real lift within two months.`,
    author: 'Mark Torres',
    role: 'Amazon Seller',
    avatar: 'https://picsum.photos/seed/mark/100/100'
  }
];

export default function Testimonials() {
  return (
    <section className='bg-white py-20 md:py-28'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl'
          >
            Trusted by Amazon sellers
          </motion.h2>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {TESTIMONIALS.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className='flex flex-col rounded-lg border border-neutral-200 bg-white p-6 shadow-sm'
            >
              <div className='mb-4 flex gap-0.5'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className='h-4 w-4 fill-amber-400 text-amber-400'
                  />
                ))}
              </div>
              <p className='mb-6 flex-1 text-base leading-relaxed text-neutral-600'>
                &quot;{test.quote}&quot;
              </p>
              <div className='flex items-center gap-3'>
                <div className='h-10 w-10 overflow-hidden rounded-full border border-neutral-200'>
                  <Image
                    src={test.avatar}
                    alt={test.author}
                    width={40}
                    height={40}
                    className='object-cover'
                    referrerPolicy='no-referrer'
                  />
                </div>
                <div>
                  <div className='text-sm font-semibold text-neutral-900'>
                    {test.author}
                  </div>
                  <div className='text-sm text-neutral-500'>{test.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
