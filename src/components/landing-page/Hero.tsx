'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Facebook,
  Linkedin,
  Sparkles,
  Star,
  User,
  X
} from 'lucide-react';
import { APP_NAME } from '@/config/url.config';
import HeroNetworkDiagram from './HeroNetworkDiagram';

// Placeholder destinations — swap for real profile URLs once they exist.
const SOCIAL_LINKS = [
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: X, label: 'X (Twitter)', href: '#' }
];

export default function Hero() {
  return (
    <section className='bg-background relative overflow-hidden pt-15 pb-20 md:pt-16 md:pb-24 lg:pt-16 lg:pb-32'>
      {/* Dot-grid background, faded toward the edges */}
      <div
        className='pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)] opacity-40'
        style={{
          backgroundImage:
            'radial-gradient(color-mix(in oklch, var(--foreground) 12%, transparent) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Subtle background gradient */}
      <div className='from-muted/40 to-background pointer-events-none absolute inset-0 bg-linear-to-b' />

      {/* Decorative gradient orbs */}
      <div className='bg-primary/10 pointer-events-none absolute top-1/4 right-0 h-125 w-125 translate-x-1/2 rounded-full blur-3xl' />
      <div className='bg-primary/5 pointer-events-none absolute bottom-0 left-1/4 h-75 w-75 rounded-full blur-3xl' />

      <div className='relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-16'>
          {/* Left: Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className='border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold'>
                <Sparkles className='h-3.5 w-3.5' />
                The knowledge layer for AI-powered teams
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className='text-foreground mt-6 text-4xl leading-[1.1] font-extrabold tracking-tighter text-balance md:text-5xl lg:text-6xl'
            >
              One source of truth for{' '}
              <span className='from-primary to-primary/60 bg-linear-to-r bg-clip-text text-transparent'>
                every AI tool
              </span>{' '}
              your team uses
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='text-foreground/80 mt-6 max-w-xl text-lg leading-relaxed font-medium md:text-xl'
            >
              {APP_NAME} organizes, versions, and publishes your project
              knowledge — Contexts, Instructions, Skills, Prompt Templates,
              Checklists, and Agent Profiles — so Claude Code, ChatGPT, Cursor,
              and any other MCP-compatible AI client works from the same
              approved standards.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className='mt-8 flex flex-col gap-3 sm:flex-row'
            >
              <Link
                href='/auth/register'
                className='group bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-base font-semibold shadow-sm transition-all'
              >
                Get Started Free
                <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-0.5' />
              </Link>
              <Link
                href='/contact'
                className='border-border bg-background text-foreground hover:bg-accent inline-flex items-center justify-center gap-2 rounded-md border px-6 py-3 text-base font-semibold shadow-sm transition-all'
              >
                Contact Us
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className='text-muted-foreground mt-6 flex flex-wrap items-center gap-4 text-sm'
            >
              <span className='flex items-center gap-1.5'>
                <Check className='text-success h-4 w-4' /> No credit card
                required
              </span>
              <span className='flex items-center gap-1.5'>
                <Check className='text-success h-4 w-4' /> Works with any MCP
                client
              </span>
              <span className='flex items-center gap-1.5'>
                <Check className='text-success h-4 w-4' /> Cancel anytime
              </span>
            </motion.div>

            {/* Social proof: avatar stack + rating + follow links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className='mt-8 flex flex-wrap items-center gap-5'
            >
              <div className='flex -space-x-2.5'>
                {[
                  'bg-primary',
                  'bg-primary/80',
                  'bg-primary/60',
                  'bg-primary/40'
                ].map((bg, idx) => (
                  <div
                    key={idx}
                    className={`border-background flex h-8 w-8 items-center justify-center rounded-full border-2 ${bg}`}
                  >
                    <User className='text-primary-foreground h-3.5 w-3.5' />
                  </div>
                ))}
              </div>

              <div>
                <div className='flex gap-0.5'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className='h-3.5 w-3.5 fill-amber-400 text-amber-400'
                    />
                  ))}
                </div>
                <p className='text-muted-foreground mt-0.5 text-xs'>
                  Loved by early AI-first teams
                </p>
              </div>

              <div className='border-border flex items-center gap-2 border-l pl-5'>
                {SOCIAL_LINKS.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className='border-border text-muted-foreground hover:border-primary/30 hover:text-primary flex h-8 w-8 items-center justify-center rounded-full border transition-colors'
                  >
                    <social.icon className='h-3.5 w-3.5' />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right: Illustrative product preview (no real screenshot yet) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='relative'
          >
            <div className='border-border bg-card relative overflow-hidden rounded-2xl border shadow-xl'>
              <div className='bg-primary/10 pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full blur-2xl' />
              <div className='bg-primary/10 pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full blur-2xl' />

              {/* Window chrome */}
              <div className='border-border relative flex items-center gap-1.5 border-b px-4 py-3'>
                <span className='bg-muted-foreground/25 h-2.5 w-2.5 rounded-full' />
                <span className='bg-muted-foreground/25 h-2.5 w-2.5 rounded-full' />
                <span className='bg-muted-foreground/25 h-2.5 w-2.5 rounded-full' />
                <span className='text-muted-foreground ml-3 flex items-center gap-1.5 text-xs font-medium'>
                  <span className='relative flex h-1.5 w-1.5'>
                    <span className='bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
                    <span className='bg-success relative inline-flex h-1.5 w-1.5 rounded-full' />
                  </span>
                  MCP connected
                </span>
              </div>

              <div className='relative'>
                <HeroNetworkDiagram />
              </div>
            </div>
            {/* Floating badge */}
            <div className='border-border bg-background text-foreground absolute -top-3 -right-3 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm'>
              Built for AI-first teams
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
