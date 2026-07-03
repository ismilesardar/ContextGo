'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useProject } from '../utils/use-projects';
import { ProjectWorkspaceNav } from './project-workspace-nav';

export function ProjectWorkspaceShell({
  children
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const workspaceSlug = (params?.workspace as string) ?? '';
  const projectId = (params?.projectId as string) ?? '';

  const { data, isLoading } = useProject(projectId);
  const project = data?.project;
  const canManage = data?.access?.isOrgAdmin === true;

  return (
    <div className='flex h-full min-h-0 flex-col'>
      <div className='border-border flex items-center justify-between gap-4 border-b px-6 py-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <Link
            href={`/${workspaceSlug}/projects`}
            className='text-muted-foreground hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md transition-colors'
          >
            <Icons.chevronLeft className='size-4' />
          </Link>

          {isLoading ? (
            <Skeleton className='h-6 w-40' />
          ) : (
            <div className='flex min-w-0 items-center gap-2'>
              <h1 className='truncate text-lg font-semibold'>
                {project?.name}
              </h1>
              {project?.status === 'archived' && (
                <Badge variant='secondary'>Archived</Badge>
              )}
            </div>
          )}
        </div>

        {canManage && (
          <Link
            href={`/${workspaceSlug}/projects/${projectId}/settings`}
            className='text-muted-foreground hover:text-foreground flex size-8 shrink-0 items-center justify-center rounded-md transition-colors'
            title='Project settings'
          >
            <Icons.settings className='size-4' />
          </Link>
        )}
      </div>

      <ProjectWorkspaceNav
        workspaceSlug={workspaceSlug}
        projectId={projectId}
      />

      <div className='min-h-0 flex-1 overflow-y-auto'>{children}</div>
    </div>
  );
}
