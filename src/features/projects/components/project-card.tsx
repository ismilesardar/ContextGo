'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { ProjectActionsMenu } from './project-actions-menu';
import type { Project } from '../utils/use-projects';

export function ProjectCard({
  project,
  workspaceSlug,
  canManage
}: {
  project: Project;
  workspaceSlug: string;
  canManage: boolean;
}) {
  return (
    <Card className='group relative gap-3 rounded-lg transition-colors hover:border-neutral-300 dark:hover:border-neutral-600'>
      <CardHeader className='flex flex-row items-start justify-between gap-2'>
        <Link
          href={`/${workspaceSlug}/projects/${project.id}`}
          className='flex min-w-0 flex-1 items-start gap-3'
        >
          <div className='bg-accent flex size-9 shrink-0 items-center justify-center rounded-md'>
            <Icons.layout className='text-accent-foreground size-4' />
          </div>
          <div className='min-w-0'>
            <CardTitle className='truncate text-base font-medium'>
              {project.name}
            </CardTitle>
            <CardDescription className='truncate text-sm'>
              {project.description || 'No description'}
            </CardDescription>
          </div>
        </Link>

        {canManage && (
          <ProjectActionsMenu project={project} workspaceSlug={workspaceSlug} />
        )}
      </CardHeader>

      <CardContent className='flex items-center justify-between'>
        {project.status === 'archived' ? (
          <Badge variant='secondary'>Archived</Badge>
        ) : (
          <Badge variant='outline'>Active</Badge>
        )}
        <span className='text-muted-foreground text-xs'>
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </span>
      </CardContent>
    </Card>
  );
}
