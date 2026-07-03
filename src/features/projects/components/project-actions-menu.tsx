'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { ProjectFormDialog } from './project-form-dialog';
import { useDeleteProjectModal } from './delete-project-modal';
import { useArchiveProject, type Project } from '../utils/use-projects';

export function ProjectActionsMenu({
  project,
  workspaceSlug
}: {
  project: Project;
  workspaceSlug: string;
}) {
  const [editOpen, setEditOpen] = useState(false);

  const archiveProject = useArchiveProject(project.id);
  const { setShowDeleteProjectModal, DeleteProjectModal } =
    useDeleteProjectModal({ project, workspaceSlug });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 shrink-0'
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.dots className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              archiveProject.mutate(
                project.status === 'archived' ? 'active' : 'archived'
              )
            }
          >
            {project.status === 'archived' ? 'Unarchive' : 'Archive'}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant='destructive'
            onSelect={() => setShowDeleteProjectModal(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProjectFormDialog
        mode='edit'
        project={project}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteProjectModal />
    </>
  );
}
