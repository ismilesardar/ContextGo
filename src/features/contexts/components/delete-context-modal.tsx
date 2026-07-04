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
import { useDeleteContext, type Context } from '../utils/use-contexts';

function DeleteContextModalHelper({
  context,
  workspaceSlug,
  projectId,
  redirectOnDelete,
  showModal,
  setShowModal
}: {
  context: Context;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const deleteContext = useDeleteContext(projectId, context.id);

  async function handleDelete() {
    await deleteContext.mutateAsync(undefined, {
      onSuccess: () => {
        setShowModal(false);
        if (redirectOnDelete) {
          router.push(`/${workspaceSlug}/projects/${projectId}/contexts`);
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
        <h3 className='text-lg font-medium'>Delete "{context.title}"?</h3>
        <p className='text-sm text-neutral-500'>
          This will permanently delete this context. This action cannot be
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
          disabled={deleteContext.isPending}
        >
          {deleteContext.isPending && <Spinner className='mr-2' />}
          Delete
        </Button>
      </div>
    </CustomModal>
  );
}

export function useDeleteContextModal({
  context,
  workspaceSlug,
  projectId,
  redirectOnDelete = false
}: {
  context: Context;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete?: boolean;
}) {
  const [showDeleteContextModal, setShowDeleteContextModal] = useState(false);

  const DeleteContextModal = useCallback(() => {
    return (
      <DeleteContextModalHelper
        context={context}
        workspaceSlug={workspaceSlug}
        projectId={projectId}
        redirectOnDelete={redirectOnDelete}
        showModal={showDeleteContextModal}
        setShowModal={setShowDeleteContextModal}
      />
    );
  }, [
    context,
    workspaceSlug,
    projectId,
    redirectOnDelete,
    showDeleteContextModal
  ]);

  return useMemo(
    () => ({ setShowDeleteContextModal, DeleteContextModal }),
    [setShowDeleteContextModal, DeleteContextModal]
  );
}
