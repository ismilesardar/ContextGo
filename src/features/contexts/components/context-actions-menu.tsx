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
import { useDeleteContextModal } from './delete-context-modal';
import { usePublishContext, type Context } from '../utils/use-contexts';

export function ContextActionsMenu({
  context,
  workspaceSlug,
  projectId
}: {
  context: Context;
  workspaceSlug: string;
  projectId: string;
}) {
  const publishContext = usePublishContext(projectId, context.id);
  const { setShowDeleteContextModal, DeleteContextModal } =
    useDeleteContextModal({ context, workspaceSlug, projectId });

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
              href={`/${workspaceSlug}/projects/${projectId}/contexts/${context.id}`}
            >
              Open
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              publishContext.mutate(
                context.status === 'published' ? 'draft' : 'published'
              )
            }
          >
            {context.status === 'published' ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant='destructive'
            onSelect={() => setShowDeleteContextModal(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteContextModal />
    </>
  );
}
