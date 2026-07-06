'use client';

import { motion } from 'motion/react';
import { Building2, Code2, Users } from 'lucide-react';

const CASES = [
  {
    icon: Building2,
    title: 'Platform & DevEx teams',
    desc: 'Standardize how every team uses AI tools — one governed set of Instructions and Checklists instead of a dozen tribal-knowledge Slack threads.'
  },
  {
    icon: Code2,
    title: 'Teams building with AI clients',
    desc: 'Claude Code, Cursor, and Copilot all read from the same published Contexts and Prompt Templates — no more re-explaining your architecture to every tool.'
  },
  {
    icon: Users,
    title: 'Agencies & consultancies',
    desc: 'Keep each client project fully isolated with its own Resources and permissions, while reusing Agent Profiles and Library templates across engagements.'
  }
];

export default function UseCases() {
  return (
    <section className='bg-background py-20 md:py-28'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'
          >
            Built for teams like yours
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='text-muted-foreground mt-4 text-lg'
          >
            Wherever AI tools touch your workflow, ContextGO keeps them aligned.
          </motion.p>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {CASES.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className='border-border bg-card flex flex-col rounded-lg border p-6 shadow-sm'
            >
              <div className='border-border bg-muted mb-4 flex h-11 w-11 items-center justify-center rounded-md border'>
                <item.icon className='text-primary h-5 w-5' />
              </div>
              <h3 className='text-foreground text-lg font-semibold'>
                {item.title}
              </h3>
              <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
