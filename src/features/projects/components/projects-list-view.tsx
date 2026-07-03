'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { IconAlertCircle, IconInbox, IconRefresh } from '@tabler/icons-react';
import { PageShell } from '@/components/layout/page-shell';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useWorkspaceStore } from '@/store';
import { useDebounce } from '@/hooks/use-debounce';
import { useProjects } from '../utils/use-projects';
import { ProjectCard } from './project-card';
import { ProjectCardSkeleton } from './project-card-skeleton';
import { ProjectFormDialog } from './project-form-dialog';

export function ProjectsListView() {
  const params = useParams();
  const workspaceSlug = (params?.workspace as string) ?? '';
  const { activeMember } = useWorkspaceStore((state) => state);
  const isOrgAdmin =
    activeMember?.role === 'owner' || activeMember?.role === 'moderator';

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [createOpen, setCreateOpen] = useState(false);

  const {
    data: projects,
    isLoading,
    isError,
    refetch
  } = useProjects({
    status: 'active',
    search: debouncedSearch || undefined
  });

  const hasActiveFilter = !!debouncedSearch;

  return (
    <>
      <PageShell
        title='Projects'
        description='Manage your organization projects and their knowledge workspaces.'
        showDate={false}
        actions={
          isOrgAdmin && (
            <Button onClick={() => setCreateOpen(true)}>
              <Icons.add className='mr-2 size-4' />
              New project
            </Button>
          )
        }
      >
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <Input
            placeholder='Search projects...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='max-w-sm'
          />
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
            <Button
              onClick={() => refetch()}
              variant='outline'
              className='mt-5'
            >
              <IconRefresh className='mr-2 size-4' />
              Try again
            </Button>
          </div>
        ) : isLoading ? (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : (projects?.length ?? 0) === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700'>
            <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800'>
              <IconInbox className='size-6 text-neutral-400' />
            </div>
            <p className='text-muted-foreground text-sm'>
              {hasActiveFilter
                ? 'No projects match your search.'
                : 'No Projects yet. Create your first project to start organizing your knowledge.'}
            </p>
            {!hasActiveFilter && isOrgAdmin && (
              <Button onClick={() => setCreateOpen(true)} className='mt-4'>
                <Icons.add className='mr-2 size-4' />
                Create project
              </Button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {projects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                workspaceSlug={workspaceSlug}
                canManage={isOrgAdmin}
              />
            ))}
          </div>
        )}
      </PageShell>

      <ProjectFormDialog
        mode='create'
        open={createOpen}
        onOpenChange={setCreateOpen}
      />
    </>
  );
}
