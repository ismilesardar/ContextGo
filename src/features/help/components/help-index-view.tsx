'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { IconSearch, IconArrowRight, IconInbox } from '@tabler/icons-react';
import Navbar from '@/components/landing-page/Navbar';
import Footer from '@/components/landing-page/Footer';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { APP_NAME } from '@/config/url.config';
import { HelpSidebar } from '@/features/help/components/help-sidebar';
import {
  HELP_ARTICLES,
  HELP_CATEGORIES,
  getArticlesByCategory
} from '@/features/help/content/help-articles';
import { CATEGORY_ICONS } from '@/features/help/utils/category-icons';

export function HelpIndexView() {
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();

  const filteredArticles = useMemo(() => {
    if (!query) return null;
    return HELP_ARTICLES.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query)
    );
  }, [query]);

  return (
    <div className='bg-background h-screen'>
      <Navbar />

      <div className='mt-20 h-[calc(100%-5rem)] overflow-y-auto'>
        <div className='mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 lg:px-8'>
          <div className='grid gap-10 lg:grid-cols-[220px_1fr]'>
            <aside className='hidden lg:block'>
              <div className='sticky top-28'>
                <HelpSidebar />
              </div>
            </aside>

            <div>
              <div className='mb-10'>
                <h1 className='text-foreground text-3xl font-semibold tracking-tight'>
                  {APP_NAME} Documentation
                </h1>
                <p className='text-muted-foreground mt-3 max-w-xl text-sm'>
                  Learn how to organize your project knowledge and connect it to
                  every AI tool your team uses.
                </p>

                <div className='relative mt-8 max-w-md'>
                  <IconSearch className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='Search documentation…'
                    className='pl-9'
                  />
                </div>
              </div>

              {filteredArticles ? (
                <div className='space-y-3'>
                  <p className='text-muted-foreground text-sm'>
                    {filteredArticles.length === 0
                      ? 'No articles match your search.'
                      : `${filteredArticles.length} article${filteredArticles.length === 1 ? '' : 's'} found`}
                  </p>
                  {filteredArticles.length === 0 ? (
                    <div className='border-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-16 text-center'>
                      <IconInbox className='text-muted-foreground h-8 w-8' />
                      <p className='text-foreground text-sm font-medium'>
                        Nothing found
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        Try a different search term.
                      </p>
                    </div>
                  ) : (
                    <div className='grid gap-4 sm:grid-cols-2'>
                      {filteredArticles.map((article) => (
                        <ArticleCard key={article.slug} article={article} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className='space-y-12'>
                  {HELP_CATEGORIES.map((category) => {
                    const Icon = CATEGORY_ICONS[category.slug];
                    const articles = getArticlesByCategory(category.slug);
                    return (
                      <section key={category.slug}>
                        <div className='mb-4 flex items-center gap-3'>
                          {Icon && (
                            <div className='bg-accent flex h-9 w-9 items-center justify-center rounded-lg'>
                              <Icon className='text-accent-foreground h-5 w-5' />
                            </div>
                          )}
                          <div>
                            <h2 className='text-foreground text-xl font-semibold'>
                              {category.title}
                            </h2>
                            <p className='text-muted-foreground text-sm'>
                              {category.description}
                            </p>
                          </div>
                        </div>

                        <div className='grid gap-4 sm:grid-cols-2'>
                          {articles.map((article) => (
                            <ArticleCard key={article.slug} article={article} />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function ArticleCard({
  article
}: {
  article: { slug: string; title: string; summary: string };
}) {
  return (
    <Link href={`/help/article/${article.slug}`}>
      <Card className='group hover:border-primary/50 h-full gap-3 py-5 transition-colors'>
        <CardHeader>
          <CardTitle className='flex items-center justify-between gap-2 text-base'>
            {article.title}
            <IconArrowRight className='text-muted-foreground h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5' />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className='text-sm'>
            {article.summary}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
