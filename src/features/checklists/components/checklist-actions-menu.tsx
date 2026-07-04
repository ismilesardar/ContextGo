'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useDeleteChecklistModal } from './delete-checklist-modal';
import { usePublishChecklist, type Checklist } from '../utils/use-checklists';

export function ChecklistActionsMenu({
  checklist,
  workspaceSlug,
  projectId
}: {
  checklist: Checklist;
  workspaceSlug: string;
  projectId: string;
}) {
  const publishChecklist = usePublishChecklist(projectId, checklist.id);
  const { setShowDeleteChecklistModal, DeleteChecklistModal } =
    useDeleteChecklistModal({ checklist, workspaceSlug, projectId });

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
          <DropdownMenuItem asChild>
            <Link
              href={`/${workspaceSlug}/projects/${projectId}/checklists/${checklist.id}`}
            >
              Open
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              publishChecklist.mutate(
                checklist.status === 'published' ? 'draft' : 'published'
              )
            }
          >
            {checklist.status === 'published' ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant='destructive'
            onSelect={() => setShowDeleteChecklistModal(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteChecklistModal />
    </>
  );
}
