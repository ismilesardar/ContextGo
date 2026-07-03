'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { useArchiveProject, type Project } from '../utils/use-projects';
import { useDeleteProjectModal } from './delete-project-modal';

export function ArchivedProjectCard({
  project,
  workspaceSlug,
  canManage
}: {
  project: Project;
  workspaceSlug: string;
  canManage: boolean;
}) {
  const restoreProject = useArchiveProject(project.id);
  const { setShowDeleteProjectModal, DeleteProjectModal } =
    useDeleteProjectModal({ project, workspaceSlug });

  return (
    <Card className='gap-3 rounded-lg'>
      <CardHeader className='flex flex-row items-start justify-between gap-2'>
        <div className='flex min-w-0 flex-1 items-start gap-3'>
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
        </div>

        {canManage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' className='size-8 shrink-0'>
                <Icons.dots className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onSelect={() => restoreProject.mutate('active')}
              >
                Restore
              </DropdownMenuItem>
              <DropdownMenuItem
                variant='destructive'
                onSelect={() => setShowDeleteProjectModal(true)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent>
        <span className='text-muted-foreground text-xs'>
          Archived{' '}
          {new Date(
            project.archivedAt ?? project.updatedAt
          ).toLocaleDateString()}
        </span>
      </CardContent>

      <DeleteProjectModal />
    </Card>
  );
}
