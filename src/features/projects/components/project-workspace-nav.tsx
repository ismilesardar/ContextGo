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
          <Link
            key={item.segment}
            href={href}
            className={cn(
              'text-muted-foreground hover:text-foreground flex shrink-0 items-center gap-2 border-b-2 border-transparent px-3 py-3 text-sm font-medium transition-colors',
              isActive && 'border-primary text-foreground'
            )}
          >
            <Icon className='size-4' />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
