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
import { useDeleteProject, type Project } from '../utils/use-projects';

function DeleteProjectModalHelper({
  project,
  workspaceSlug,
  showModal,
  setShowModal
}: {
  project: Project;
  workspaceSlug: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const deleteProject = useDeleteProject(project.id);

  async function handleDelete() {
    await deleteProject.mutateAsync(undefined, {
      onSuccess: () => {
        setShowModal(false);
        router.push(`/${workspaceSlug}/projects`);
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
        <h3 className='text-lg font-medium'>Delete "{project.name}"?</h3>
        <p className='text-sm text-neutral-500'>
          This will permanently delete this project and all of its data. This
          action cannot be undone.
        </p>
      </div>

      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleDelete}
          disabled={deleteProject.isPending}
        >
          {deleteProject.isPending && <Spinner className='mr-2' />}
          Delete
        </Button>
      </div>
    </CustomModal>
  );
}

export function useDeleteProjectModal({
  project,
  workspaceSlug
}: {
  project: Project;
  workspaceSlug: string;
}) {
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);

  const DeleteProjectModal = useCallback(() => {
    return (
      <DeleteProjectModalHelper
        project={project}
        workspaceSlug={workspaceSlug}
        showModal={showDeleteProjectModal}
        setShowModal={setShowDeleteProjectModal}
      />
    );
  }, [project, workspaceSlug, showDeleteProjectModal]);

  return useMemo(
    () => ({ setShowDeleteProjectModal, DeleteProjectModal }),
    [setShowDeleteProjectModal, DeleteProjectModal]
  );
}
