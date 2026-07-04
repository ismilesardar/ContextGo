'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { useRouter } from 'next/navigation';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  useDeleteInstruction,
  type Instruction
} from '../utils/use-instructions';

function DeleteInstructionModalHelper({
  instruction,
  workspaceSlug,
  projectId,
  redirectOnDelete,
  showModal,
  setShowModal
}: {
  instruction: Instruction;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const deleteInstruction = useDeleteInstruction(projectId, instruction.id);

  async function handleDelete() {
    await deleteInstruction.mutateAsync(undefined, {
      onSuccess: () => {
        setShowModal(false);
        if (redirectOnDelete) {
          router.push(`/${workspaceSlug}/projects/${projectId}/instructions`);
        }
      }
    });
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-md'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>Delete "{instruction.title}"?</h3>
        <p className='text-sm text-neutral-500'>
          This will permanently delete this instruction. This action cannot be
          undone.
        </p>
      </div>

      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleDelete}
          disabled={deleteInstruction.isPending}
        >
          {deleteInstruction.isPending && <Spinner className='mr-2' />}
          Delete
        </Button>
      </div>
    </CustomModal>
  );
}

export function useDeleteInstructionModal({
  instruction,
  workspaceSlug,
  projectId,
  redirectOnDelete = false
}: {
  instruction: Instruction;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete?: boolean;
}) {
  const [showDeleteInstructionModal, setShowDeleteInstructionModal] =
    useState(false);

  const DeleteInstructionModal = useCallback(() => {
    return (
      <DeleteInstructionModalHelper
        instruction={instruction}
        workspaceSlug={workspaceSlug}
        projectId={projectId}
        redirectOnDelete={redirectOnDelete}
        showModal={showDeleteInstructionModal}
        setShowModal={setShowDeleteInstructionModal}
      />
    );
  }, [
    instruction,
    workspaceSlug,
    projectId,
    redirectOnDelete,
    showDeleteInstructionModal
  ]);

  return useMemo(
    () => ({ setShowDeleteInstructionModal, DeleteInstructionModal }),
    [setShowDeleteInstructionModal, DeleteInstructionModal]
  );
}
