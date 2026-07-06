'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { APP_NAME } from '@/config/url.config';

export type FaqItem = {
  q: string;
  a: string;
};

const DEFAULT_FAQS: FaqItem[] = [
  {
    q: 'Is my organization’s knowledge isolated from other organizations?',
    a: `Yes. ${APP_NAME} is fully multi-tenant — every Project's Resources belong to exactly one Organization, and access is enforced by role-based permissions. One project can never read another project's knowledge unless it's explicitly shared.`
  },
  {
    q: 'What happens to a Resource before it’s published?',
    a: 'Every Context, Instruction, Skill, Prompt Template, Checklist, and Agent Profile keeps full draft/version history. Only a version an org admin has explicitly set as "Main" is ever served to AI clients — drafts and unpublished edits stay invisible to MCP and the API.'
  },
  {
    q: 'How do AI clients actually connect?',
    a: `Through ${APP_NAME}'s MCP server or public API. You create an MCP Identity (a service account) for the connection, grant it specific Resources, and issue it an API key — Claude Code, ChatGPT, Cursor, and Copilot all authenticate the same way.`
  },
  {
    q: 'What are Contexts?',
    a: 'Contexts capture your architecture documentation, business rules, and technical decisions — the background an AI tool needs before it can make a good suggestion in your codebase.'
  },
  {
    q: 'What are Instructions?',
    a: 'Instructions are your team’s AI behavior rules: coding conventions, naming standards, security requirements, and documentation standards, written once and followed by every connected AI client.'
  },
  {
    q: 'What are Skills?',
    a: 'Skills are reusable workflows and standard operating procedures — code review steps, deployment processes, task execution guides — that both your team and AI tools can follow the same way every time.'
  },
  {
    q: 'What are Prompt Templates?',
    a: 'Prompt Templates are a shared library of reusable prompts organized by category, so your team stops rewriting the same AI task prompts from scratch.'
  },
  {
    q: 'What are Checklists?',
    a: 'Checklists cover QA, release, and security verification steps — a governed, versioned list your team and AI assistants can both check off before something ships.'
  },
  {
    q: 'What are Agent Profiles?',
    a: 'Agent Profiles bundle multiple Resources into a single reusable AI role — a Backend Developer, QA, or Product Manager profile, for example — so an AI client gets everything it needs for that role in one grant.'
  },
  {
    q: 'Where do Library templates come from?',
    a: 'The Library syncs community-contributed Instructions, Skills, and Prompt Templates from the public github/awesome-copilot repository. You can preview any template before importing it into your own project as an editable Resource.'
  },
  {
    q: 'Can I edit a template after importing it from the Library?',
    a: 'Yes. Importing a Library template creates a normal, editable Resource in your project — it’s a starting point, not a locked reference. From there it has the same draft/version history as anything you write from scratch.'
  },
  {
    q: 'Who can import from the Library?',
    a: 'Browsing and previewing the Library is open to any authenticated user. Importing a template into a project requires org owner or moderator permissions, same as creating any other Resource.'
  }
];

export default function FAQ({
  items = DEFAULT_FAQS,
  title = 'Frequently asked questions'
}: {
  items?: FaqItem[];
  title?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id='faq'
      className='border-border bg-background border-t py-20 md:py-28'
    >
      <div className='mx-auto max-w-3xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-16 text-center'>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='text-foreground mb-4 text-3xl font-bold tracking-tight md:text-4xl'
          >
            {title}
          </motion.h2>
        </div>

        <div className='space-y-3'>
          {items.map((faq, idx) => (
            <div
              key={idx}
              className='border-border bg-card overflow-hidden rounded-lg border'
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className='flex w-full items-center justify-between px-5 py-4 text-left focus-visible:outline-none'
              >
                <span className='text-foreground text-sm font-medium'>
                  {faq.q}
                </span>
                <ChevronDown
                  className={`text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200 ${
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
                    transition={{ duration: 0.2 }}
                  >
                    <div className='border-border text-muted-foreground border-t px-5 py-4 text-sm leading-relaxed'>
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
