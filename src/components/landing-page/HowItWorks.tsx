'use client';

import { motion } from 'motion/react';
import { FolderKanban, GitBranch, Plug2 } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

const STEPS = [
  {
    icon: FolderKanban,
    title: 'Create your project workspace',
    desc: 'Spin up an Organization and Project, then build out Contexts, Instructions, Skills, and more — fully isolated from every other project.'
  },
  {
    icon: GitBranch,
    title: 'Draft, review, and publish',
    desc: `Every Resource keeps full version history. Nothing is live for AI tools until an org admin explicitly sets it as the Main version.`
  },
  {
    icon: Plug2,
    title: 'Connect any AI client',
    desc: `Expose approved knowledge through ${APP_NAME}'s MCP server or public API — Claude Code, ChatGPT, Cursor, and Copilot all read from the same source.`
  }
];

export default function HowItWorks() {
  return (
    <section
      id='how-it-works'
      className='border-border bg-muted/30 border-y py-20 md:py-28'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Z-pattern lead-in: visual left, text right (flips against Hero's text-left/visual-right) */}
        <div className='mb-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16'>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='order-2 lg:order-1'
          >
            <div className='border-border bg-card relative overflow-hidden rounded-2xl border p-8 shadow-sm'>
              <div className='bg-primary/10 pointer-events-none absolute -top-8 -left-8 h-36 w-36 rounded-full blur-2xl' />
              <div className='relative flex items-center'>
                {STEPS.map((step, idx) => (
                  <div key={step.title} className='flex flex-1 items-center'>
                    <div className='flex flex-1 flex-col items-center gap-2'>
                      <div className='border-border bg-background flex h-11 w-11 items-center justify-center rounded-full border'>
                        <step.icon className='text-primary h-5 w-5' />
                      </div>
                      <span className='text-muted-foreground text-xs font-medium'>
                        Step {idx + 1}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className='bg-border mb-6 h-px w-6 shrink-0' />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='order-1 lg:order-2'
          >
            <h2 className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'>
              How it works
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Three steps take you from scattered docs to a governed, versioned
              knowledge layer every AI tool can trust.
            </p>
          </motion.div>
        </div>

        <div className='grid gap-8 md:grid-cols-3'>
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className='border-border bg-card relative rounded-xl border p-8 shadow-sm'
              >
                <div className='border-border bg-background mb-6 flex h-12 w-12 items-center justify-center rounded-lg border'>
                  <Icon className='text-foreground h-6 w-6' />
                </div>
                <div className='mb-2 flex items-center gap-2'>
                  <span className='bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold'>
                    {idx + 1}
                  </span>
                </div>
                <h3 className='text-foreground mb-2 text-lg font-semibold'>
                  {step.title}
                </h3>
                <p className='text-muted-foreground text-sm leading-relaxed'>
                  {step.desc}
                </p>

                {/* Connector */}
                {idx < STEPS.length - 1 && (
                  <div className='bg-border absolute top-1/2 -right-4 hidden h-px w-8 md:block' />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
