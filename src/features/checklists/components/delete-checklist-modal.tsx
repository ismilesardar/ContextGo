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
import { useDeleteChecklist, type Checklist } from '../utils/use-checklists';

function DeleteChecklistModalHelper({
  checklist,
  workspaceSlug,
  projectId,
  redirectOnDelete,
  showModal,
  setShowModal
}: {
  checklist: Checklist;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const deleteChecklist = useDeleteChecklist(projectId, checklist.id);

  async function handleDelete() {
    await deleteChecklist.mutateAsync(undefined, {
      onSuccess: () => {
        setShowModal(false);
        if (redirectOnDelete) {
          router.push(`/${workspaceSlug}/projects/${projectId}/checklists`);
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
        <h3 className='text-lg font-medium'>Delete "{checklist.title}"?</h3>
        <p className='text-sm text-neutral-500'>
          This will permanently delete this checklist. This action cannot be
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
          disabled={deleteChecklist.isPending}
        >
          {deleteChecklist.isPending && <Spinner className='mr-2' />}
          Delete
        </Button>
      </div>
    </CustomModal>
  );
}

export function useDeleteChecklistModal({
  checklist,
  workspaceSlug,
  projectId,
  redirectOnDelete = false
}: {
  checklist: Checklist;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete?: boolean;
}) {
  const [showDeleteChecklistModal, setShowDeleteChecklistModal] =
    useState(false);

  const DeleteChecklistModal = useCallback(() => {
    return (
      <DeleteChecklistModalHelper
        checklist={checklist}
        workspaceSlug={workspaceSlug}
        projectId={projectId}
        redirectOnDelete={redirectOnDelete}
        showModal={showDeleteChecklistModal}
        setShowModal={setShowDeleteChecklistModal}
      />
    );
  }, [
    checklist,
    workspaceSlug,
    projectId,
    redirectOnDelete,
    showDeleteChecklistModal
  ]);

  return useMemo(
    () => ({ setShowDeleteChecklistModal, DeleteChecklistModal }),
    [setShowDeleteChecklistModal, DeleteChecklistModal]
  );
}
