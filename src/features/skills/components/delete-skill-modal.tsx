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
import { useDeleteSkill, type Skill } from '../utils/use-skills';

function DeleteSkillModalHelper({
  skill,
  workspaceSlug,
  projectId,
  redirectOnDelete,
  showModal,
  setShowModal
}: {
  skill: Skill;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const deleteSkill = useDeleteSkill(projectId, skill.id);

  async function handleDelete() {
    await deleteSkill.mutateAsync(undefined, {
      onSuccess: () => {
        setShowModal(false);
        if (redirectOnDelete) {
          router.push(`/${workspaceSlug}/projects/${projectId}/skills`);
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
        <h3 className='text-lg font-medium'>Delete "{skill.title}"?</h3>
        <p className='text-sm text-neutral-500'>
          This will permanently delete this skill. This action cannot be undone.
        </p>
      </div>

      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleDelete}
          disabled={deleteSkill.isPending}
        >
          {deleteSkill.isPending && <Spinner className='mr-2' />}
          Delete
        </Button>
      </div>
    </CustomModal>
  );
}

export function useDeleteSkillModal({
  skill,
  workspaceSlug,
  projectId,
  redirectOnDelete = false
}: {
  skill: Skill;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete?: boolean;
}) {
  const [showDeleteSkillModal, setShowDeleteSkillModal] = useState(false);

  const DeleteSkillModal = useCallback(() => {
    return (
      <DeleteSkillModalHelper
        skill={skill}
        workspaceSlug={workspaceSlug}
        projectId={projectId}
        redirectOnDelete={redirectOnDelete}
        showModal={showDeleteSkillModal}
        setShowModal={setShowDeleteSkillModal}
      />
    );
  }, [skill, workspaceSlug, projectId, redirectOnDelete, showDeleteSkillModal]);

  return useMemo(
    () => ({ setShowDeleteSkillModal, DeleteSkillModal }),
    [setShowDeleteSkillModal, DeleteSkillModal]
  );
}
