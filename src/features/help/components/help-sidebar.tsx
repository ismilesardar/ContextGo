'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  HELP_CATEGORIES,
  getArticlesByCategory
} from '@/features/help/content/help-articles';
import { CATEGORY_ICONS } from '@/features/help/utils/category-icons';

export function HelpSidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <nav className='space-y-6'>
      {HELP_CATEGORIES.map((category) => {
        const Icon = CATEGORY_ICONS[category.slug];
        const articles = getArticlesByCategory(category.slug);
        return (
          <div key={category.slug}>
            <div className='text-muted-foreground mb-2 flex items-center gap-2 text-xs font-semibold tracking-wide uppercase'>
              {Icon && <Icon className='h-3.5 w-3.5' />}
              {category.title}
            </div>
            <ul className='space-y-0.5'>
              {articles.map((article) => {
                const isActive = article.slug === activeSlug;
                return (
                  <li key={article.slug}>
                    <Link
                      href={`/help/article/${article.slug}`}
                      className={cn(
                        'block rounded-md px-2 py-1.5 text-sm transition-colors',
                        isActive
                          ? 'bg-accent text-foreground font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      )}
                    >
                      {article.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}
