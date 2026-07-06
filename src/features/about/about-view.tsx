'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { GitBranch, Layers, Plug, ArrowRight } from 'lucide-react';
import { Navbar, Footer } from '@/components/landing-page';
import { APP_NAME } from '@/config/url.config';

const VALUES = [
  {
    icon: GitBranch,
    title: 'Governed, versioned knowledge',
    desc: 'Every Resource keeps full version history with an explicit Main pointer — nothing reaches an AI client until an org admin says it should.'
  },
  {
    icon: Plug,
    title: 'Works with any AI client',
    desc: `We built ${APP_NAME} around open standards — MCP and a public API — so it plugs into Claude Code, ChatGPT, Cursor, Copilot, and whatever comes next.`
  },
  {
    icon: Layers,
    title: 'Isolated by design',
    desc: 'Every organization, project, and resource is scoped and permissioned from the ground up — knowledge never leaks across projects by accident.'
  }
];

export function AboutView() {
  return (
    <div className='bg-background h-screen'>
      <Navbar />

      <div className='mt-20 h-[calc(100%-5rem)] overflow-y-auto'>
        {/* Hero */}
        <section className='bg-background relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24'>
          <div className='from-muted/40 to-background pointer-events-none absolute inset-0 bg-linear-to-b' />
          <div className='relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className='border-border bg-muted text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium'>
                About Us
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className='text-foreground mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'
            >
              The knowledge layer{' '}
              <span className='from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent'>
                for AI-powered teams
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className='text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed'
            >
              {APP_NAME} gives organizations a single, governed source of
              project knowledge — so every AI tool your team uses works from the
              same approved standards.
            </motion.p>
          </div>
        </section>

        {/* Mission */}
        <section className='border-border bg-muted/30 border-y py-20'>
          <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
            <div className='grid items-center gap-12 lg:grid-cols-2'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className='text-foreground text-2xl font-bold tracking-tight md:text-3xl'>
                  Why we built {APP_NAME}
                </h2>
                <p className='text-muted-foreground mt-4 leading-relaxed'>
                  AI tools are everywhere on a modern team — but each one only
                  knows what you happen to paste into it. Architecture
                  decisions, coding standards, and team workflows get
                  re-explained constantly, and drift apart the moment two people
                  phrase them differently.
                </p>
                <p className='text-muted-foreground mt-4 leading-relaxed'>
                  We built {APP_NAME} to give organizations one governed,
                  versioned place for that knowledge — Contexts, Instructions,
                  Skills, Prompt Templates, Checklists, and Agent Profiles — and
                  a single way to publish it to every AI client at once.
                </p>
                <p className='text-muted-foreground mt-4 leading-relaxed'>
                  No more re-explaining your standards to every tool. Publish
                  once, and every AI assistant follows the same rules.
                </p>
                <Link
                  href='/auth/register'
                  className='bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-all'
                >
                  Get Started Free
                  <ArrowRight className='h-4 w-4' />
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className='grid grid-cols-2 gap-4'
              >
                {[
                  { label: 'Resource types', value: '6' },
                  { label: 'MCP-compatible AI clients', value: '∞' },
                  { label: 'Integration surfaces', value: 'MCP + API' },
                  { label: 'Projects isolated', value: '100%' }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className='border-border bg-card rounded-xl border p-5 text-center'
                  >
                    <div className='text-foreground text-2xl font-bold'>
                      {stat.value}
                    </div>
                    <div className='text-muted-foreground mt-1 text-sm'>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className='py-20'>
          <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
            <div className='mb-12 text-center'>
              <h2 className='text-foreground text-2xl font-bold tracking-tight md:text-3xl'>
                Our values
              </h2>
            </div>
            <div className='grid gap-6 md:grid-cols-3'>
              {VALUES.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className='border-border bg-card rounded-xl border p-6'
                  >
                    <div className='border-border bg-muted mb-4 flex h-10 w-10 items-center justify-center rounded-lg border'>
                      <Icon className='text-primary h-5 w-5' />
                    </div>
                    <h3 className='text-foreground text-lg font-semibold'>
                      {value.title}
                    </h3>
                    <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                      {value.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className='border-border bg-muted/30 border-t py-20'>
          <div className='mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
            <h2 className='text-foreground text-2xl font-bold tracking-tight md:text-3xl'>
              Ready to give your AI tools a shared source of truth?
            </h2>
            <p className='text-muted-foreground mt-4 text-lg'>
              Join teams using {APP_NAME} to organize and publish their project
              knowledge.
            </p>
            <Link
              href='/auth/register'
              className='bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex items-center gap-2 rounded-md px-8 py-4 text-base font-semibold transition-all'
            >
              Get Started Free
              <ArrowRight className='h-4 w-4' />
            </Link>
            <p className='text-muted-foreground mt-4 text-sm'>
              No credit card required &middot; Cancel anytime
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
