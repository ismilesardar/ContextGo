'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  ListChecks,
  MessageSquareText,
  Network,
  ScrollText,
  Sparkles,
  UserSquare2,
  Zap
} from 'lucide-react';

export const FEATURES = [
  {
    icon: ScrollText,
    title: 'Contexts',
    desc: 'Architecture, business rules, and technical decisions every AI client should already know.',
    href: '/help/article/contexts'
  },
  {
    icon: BookOpen,
    title: 'Instructions',
    desc: 'Coding conventions, naming standards, and security requirements — written once, followed everywhere.',
    href: '/help/article/instructions'
  },
  {
    icon: Zap,
    title: 'Skills',
    desc: 'Reusable workflows and standard operating procedures for repeatable tasks.',
    href: '/help/article/skills'
  },
  {
    icon: MessageSquareText,
    title: 'Prompt Templates',
    desc: 'A shared library of prompts your whole team can reuse instead of reinventing.',
    href: '/help/article/prompt-templates'
  },
  {
    icon: ListChecks,
    title: 'Checklists',
    desc: 'QA, release, and security verification steps that AI and teammates can both follow.',
    href: '/help/article/checklists'
  },
  {
    icon: UserSquare2,
    title: 'Agent Profiles',
    desc: 'Bundle Resources into reusable AI roles — Backend, Frontend, QA, PM, and more.',
    href: '/help/article/agent-profiles'
  },
  {
    icon: Network,
    title: 'MCP Server + API',
    desc: 'Expose only what’s published, securely, to any AI client that speaks MCP.',
    href: '/help/article/mcp-and-ai-integrations'
  },
  {
    icon: Sparkles,
    title: 'Library',
    desc: 'Browse and import community-contributed Instructions, Skills, and Prompt Templates.',
    href: '/help/article/library'
  }
];

export default function FeatureGrid() {
  return (
    <section id='features' className='bg-background py-20 md:py-28'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto mb-16 max-w-3xl text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'
          >
            Everything your knowledge layer needs
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='text-muted-foreground mt-4 text-lg'
          >
            Six resource types, one governed source, published to every AI tool
            your team already uses.
          </motion.p>
        </div>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 4) * 0.08 }}
              className='group border-border bg-card rounded-lg border p-6 shadow-sm'
            >
              <div className='border-border bg-muted mb-4 flex h-10 w-10 items-center justify-center rounded-md border'>
                <feature.icon className='text-primary h-5 w-5' />
              </div>
              <h3 className='text-foreground text-base font-semibold'>
                {feature.title}
              </h3>
              <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
                {feature.desc}
              </p>
              <Link
                href={feature.href}
                className='text-primary mt-3 flex max-h-0 items-center gap-1 text-sm font-medium opacity-0 transition-all duration-200 group-hover:max-h-8 group-hover:opacity-100'
              >
                Learn more
                <ArrowRight className='h-3.5 w-3.5' />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
