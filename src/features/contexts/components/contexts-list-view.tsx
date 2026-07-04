'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { IconAlertCircle, IconInbox, IconRefresh } from '@tabler/icons-react';
import { PageShell } from '@/components/layout/page-shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/icons';
import { useDebounce } from '@/hooks/use-debounce';
import { useProject } from '@/features/projects/utils/use-projects';
import { useContexts, type Context } from '../utils/use-contexts';
import { ContextCard } from './context-card';
import { ContextCardSkeleton } from './context-card-skeleton';

type StatusFilter = 'all' | 'draft' | 'published';
type SortOption = 'updated' | 'title';

export function ContextsListView({
  workspaceSlug,
  projectId
}: {
  workspaceSlug: string;
  projectId: string;
}) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOption>('updated');

  const { data: projectData } = useProject(projectId);
  const canManage = projectData?.access?.isOrgAdmin === true;

  const {
    data: contexts,
    isLoading,
    isError,
    refetch
  } = useContexts(projectId, {
    status: status === 'all' ? undefined : status,
    search: debouncedSearch || undefined
  });

  const sortedContexts = useMemo(() => {
    if (!contexts) return contexts;
    const list = [...contexts];
    if (sort === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
    return list;
  }, [contexts, sort]);

  const hasActiveFilter = !!debouncedSearch || status !== 'all';

  return (
    <PageShell
      title='Contexts'
      description='Long-term project knowledge — architecture, business rules, and standards every AI tool should follow.'
      showDate={false}
      actions={
        canManage && (
          <Button asChild>
            <Link href={`/${workspaceSlug}/projects/${projectId}/contexts/new`}>
              <Icons.add className='mr-2 size-4' />
              Create context
            </Link>
          </Button>
        )
      }
    >
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Input
          placeholder='Search contexts...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-sm'
        />

        <div className='flex items-center gap-2'>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as StatusFilter)}
          >
            <SelectTrigger className='w-36'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All statuses</SelectItem>
              <SelectItem value='draft'>Draft</SelectItem>
              <SelectItem value='published'>Published</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortOption)}
          >
            <SelectTrigger className='w-36'>
              <SelectValue placeholder='Sort' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='updated'>Last updated</SelectItem>
              <SelectItem value='title'>Title</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/80 p-16 text-center dark:border-red-900 dark:bg-red-950/50'>
          <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50'>
            <IconAlertCircle className='size-6 text-red-600 dark:text-red-400' />
          </div>
          <p className='text-foreground text-lg font-semibold'>
            Unable to load
          </p>
          <p className='text-muted-foreground mt-1.5 text-sm'>
            Something went wrong. Please try again.
          </p>
          <Button onClick={() => refetch()} variant='outline' className='mt-5'>
            <IconRefresh className='mr-2 size-4' />
            Try again
          </Button>
        </div>
      ) : isLoading ? (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <ContextCardSkeleton key={i} />
          ))}
        </div>
      ) : (sortedContexts?.length ?? 0) === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700'>
          <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800'>
            <IconInbox className='size-6 text-neutral-400' />
          </div>
          <p className='text-muted-foreground text-sm'>
            {hasActiveFilter
              ? 'No contexts match your search.'
              : 'No Contexts yet. Create your first Context to document important project knowledge.'}
          </p>
          {!hasActiveFilter && canManage && (
            <Button asChild className='mt-4'>
              <Link
                href={`/${workspaceSlug}/projects/${projectId}/contexts/new`}
              >
                <Icons.add className='mr-2 size-4' />
                Create context
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {sortedContexts?.map((context: Context) => (
            <ContextCard
              key={context.id}
              context={context}
              workspaceSlug={workspaceSlug}
              projectId={projectId}
              canManage={canManage}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
