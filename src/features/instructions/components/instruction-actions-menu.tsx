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
import { useDeleteInstructionModal } from './delete-instruction-modal';
import {
  usePublishInstruction,
  type Instruction
} from '../utils/use-instructions';

export function InstructionActionsMenu({
  instruction,
  workspaceSlug,
  projectId
}: {
  instruction: Instruction;
  workspaceSlug: string;
  projectId: string;
}) {
  const publishInstruction = usePublishInstruction(projectId, instruction.id);
  const { setShowDeleteInstructionModal, DeleteInstructionModal } =
    useDeleteInstructionModal({ instruction, workspaceSlug, projectId });

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
              href={`/${workspaceSlug}/projects/${projectId}/instructions/${instruction.id}`}
            >
              Open
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              publishInstruction.mutate(
                instruction.status === 'published' ? 'draft' : 'published'
              )
            }
          >
            {instruction.status === 'published' ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant='destructive'
            onSelect={() => setShowDeleteInstructionModal(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteInstructionModal />
    </>
  );
}
