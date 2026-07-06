'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function PricingTeaser() {
  return (
    <section className='border-border bg-muted/30 border-y py-20 md:py-28'>
      <div className='mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'
        >
          Simple plans as you grow
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className='text-muted-foreground mt-4 text-lg'
        >
          Start free, upgrade only when your organization needs more projects
          and workspaces.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className='mt-8'
        >
          <Link
            href='/pricing'
            className='border-border bg-background text-foreground hover:bg-accent inline-flex items-center justify-center gap-2 rounded-md border px-6 py-3 text-base font-semibold shadow-sm transition-all'
          >
            See full pricing
            <ArrowRight className='h-4 w-4' />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
