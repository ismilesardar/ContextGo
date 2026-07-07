'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { PROJECT_NAV_ITEMS } from '../utils/project-nav-items';

export function ProjectWorkspaceNav({
  workspaceSlug,
  projectId
}: {
  workspaceSlug: string;
  projectId: string;
}) {
  const pathname = usePathname();
  const basePath = `/${workspaceSlug}/projects/${projectId}`;

  return (
    <nav className='border-border flex items-center gap-1 overflow-x-auto border-b px-6'>
      {PROJECT_NAV_ITEMS.map((item) => {
        const href = `${basePath}/${item.segment}`;
        const isActive = pathname.startsWith(href);
        const Icon = Icons[item.icon];

        return (
          <div
            key={item.segment}
            className={cn(
              'group flex shrink-0 items-center gap-1 border-b-2 border-transparent px-3 py-3',
              isActive && 'border-primary'
            )}
          >
            <Link
              href={href}
              className={cn(
                'text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors',
                isActive && 'text-foreground'
              )}
            >
              <Icon className='size-4' />
              {item.title}
            </Link>
            <Link
              href={`/help/article/${item.helpSlug}`}
              target='_blank'
              rel='noopener noreferrer'
              title={`${item.title} documentation`}
              aria-label={`${item.title} documentation`}
              className='text-muted-foreground/60 hover:text-foreground shrink-0 opacity-0 transition-opacity group-hover:opacity-100'
            >
              <Icons.help className='size-3.5' />
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
