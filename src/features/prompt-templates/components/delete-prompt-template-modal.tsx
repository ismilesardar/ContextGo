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
  useDeletePromptTemplate,
  type PromptTemplate
} from '../utils/use-prompt-templates';

function DeletePromptTemplateModalHelper({
  promptTemplate,
  workspaceSlug,
  projectId,
  redirectOnDelete,
  showModal,
  setShowModal
}: {
  promptTemplate: PromptTemplate;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const deletePromptTemplate = useDeletePromptTemplate(
    projectId,
    promptTemplate.id
  );

  async function handleDelete() {
    await deletePromptTemplate.mutateAsync(undefined, {
      onSuccess: () => {
        setShowModal(false);
        if (redirectOnDelete) {
          router.push(
            `/${workspaceSlug}/projects/${projectId}/prompt-templates`
          );
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
        <h3 className='text-lg font-medium'>
          Delete "{promptTemplate.title}"?
        </h3>
        <p className='text-sm text-neutral-500'>
          This will permanently delete this promptTemplate. This action cannot
          be undone.
        </p>
      </div>

      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleDelete}
          disabled={deletePromptTemplate.isPending}
        >
          {deletePromptTemplate.isPending && <Spinner className='mr-2' />}
          Delete
        </Button>
      </div>
    </CustomModal>
  );
}

export function useDeletePromptTemplateModal({
  promptTemplate,
  workspaceSlug,
  projectId,
  redirectOnDelete = false
}: {
  promptTemplate: PromptTemplate;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete?: boolean;
}) {
  const [showDeletePromptTemplateModal, setShowDeletePromptTemplateModal] =
    useState(false);

  const DeletePromptTemplateModal = useCallback(() => {
    return (
      <DeletePromptTemplateModalHelper
        promptTemplate={promptTemplate}
        workspaceSlug={workspaceSlug}
        projectId={projectId}
        redirectOnDelete={redirectOnDelete}
        showModal={showDeletePromptTemplateModal}
        setShowModal={setShowDeletePromptTemplateModal}
      />
    );
  }, [
    promptTemplate,
    workspaceSlug,
    projectId,
    redirectOnDelete,
    showDeletePromptTemplateModal
  ]);

  return useMemo(
    () => ({ setShowDeletePromptTemplateModal, DeletePromptTemplateModal }),
    [setShowDeletePromptTemplateModal, DeletePromptTemplateModal]
  );
}
