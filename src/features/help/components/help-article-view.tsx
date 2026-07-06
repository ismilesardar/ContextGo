'use client';

import type { ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Navbar from '@/components/landing-page/Navbar';
import Footer from '@/components/landing-page/Footer';
import { Markdown } from '@/components/share/markdown';
import { HelpSidebar } from '@/features/help/components/help-sidebar';
import {
  getAdjacentArticles,
  getHelpArticle,
  HELP_CATEGORIES
} from '@/features/help/content/help-articles';

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractHeadings(content: string): { id: string; text: string }[] {
  return content
    .split('\n')
    .filter((line) => line.startsWith('## '))
    .map((line) => {
      const text = line.replace(/^##\s+/, '').trim();
      return { id: slugifyHeading(text), text };
    });
}

export function HelpArticleView({ slug }: { slug: string }) {
  const article = getHelpArticle(slug);
  if (!article) notFound();

  const category = HELP_CATEGORIES.find((c) => c.slug === article.categorySlug);
  const headings = extractHeadings(article.content);
  const { previous, next } = getAdjacentArticles(slug);

  return (
    <div className='bg-background h-screen'>
      <Navbar />

      <div className='mt-20 h-[calc(100%-5rem)] overflow-y-auto'>
        <div className='mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 lg:px-8'>
          <div className='mb-6 flex items-center gap-2 text-sm'>
            <Link
              href='/help'
              className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors'
            >
              <IconChevronLeft className='h-4 w-4' />
              Documentation
            </Link>
            {category && (
              <>
                <span className='text-muted-foreground'>/</span>
                <span className='text-muted-foreground'>{category.title}</span>
              </>
            )}
          </div>

          <div className='grid gap-10 lg:grid-cols-[220px_1fr_220px]'>
            <aside className='hidden lg:block'>
              <div className='sticky top-28'>
                <HelpSidebar activeSlug={slug} />
              </div>
            </aside>

            <article>
              <h1 className='text-foreground mb-2 text-3xl font-semibold tracking-tight'>
                {article.title}
              </h1>
              <p className='text-muted-foreground mb-8 text-sm'>
                {article.summary}
              </p>

              <Markdown
                className='prose-headings:scroll-mt-24'
                components={{
                  h2: ({
                    node: _node,
                    children,
                    ...props
                  }: ComponentPropsWithoutRef<'h2'> & {
                    node?: unknown;
                  }) => (
                    <h2 id={slugifyHeading(String(children))} {...props}>
                      {children}
                    </h2>
                  )
                }}
              >
                {article.content}
              </Markdown>

              <div className='border-border mt-12 flex items-center justify-between gap-4 border-t pt-6'>
                {previous ? (
                  <Link
                    href={`/help/article/${previous.slug}`}
                    className='group flex min-w-0 flex-col items-start'
                  >
                    <span className='text-muted-foreground text-xs'>
                      Previous
                    </span>
                    <span className='text-foreground group-hover:text-primary flex items-center gap-1 text-sm font-medium'>
                      <IconChevronLeft className='h-4 w-4 shrink-0' />
                      <span className='truncate'>{previous.title}</span>
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link
                    href={`/help/article/${next.slug}`}
                    className='group flex min-w-0 flex-col items-end text-right'
                  >
                    <span className='text-muted-foreground text-xs'>Next</span>
                    <span className='text-foreground group-hover:text-primary flex items-center gap-1 text-sm font-medium'>
                      <span className='truncate'>{next.title}</span>
                      <IconChevronRight className='h-4 w-4 shrink-0' />
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            </article>

            {headings.length > 0 && (
              <aside className='hidden lg:block'>
                <div className='sticky top-28'>
                  <p className='text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase'>
                    On this page
                  </p>
                  <nav className='space-y-2 text-sm'>
                    {headings.map((heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        className='text-muted-foreground hover:text-foreground block transition-colors'
                      >
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
