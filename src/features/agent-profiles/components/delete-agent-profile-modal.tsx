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
  useDeleteAgentProfile,
  type AgentProfile
} from '../utils/use-agent-profiles';

function DeleteAgentProfileModalHelper({
  agentProfile,
  workspaceSlug,
  projectId,
  redirectOnDelete,
  showModal,
  setShowModal
}: {
  agentProfile: AgentProfile;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete: boolean;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const deleteAgentProfile = useDeleteAgentProfile(projectId, agentProfile.id);

  async function handleDelete() {
    await deleteAgentProfile.mutateAsync(undefined, {
      onSuccess: () => {
        setShowModal(false);
        if (redirectOnDelete) {
          router.push(`/${workspaceSlug}/projects/${projectId}/agent-profiles`);
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
        <h3 className='text-lg font-medium'>Delete "{agentProfile.title}"?</h3>
        <p className='text-sm text-neutral-500'>
          This will permanently delete this agent profile. This action cannot be
          undone. The Instructions, Skills, Prompt Templates, and Checklists it
          bundles are not affected.
        </p>
      </div>

      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleDelete}
          disabled={deleteAgentProfile.isPending}
        >
          {deleteAgentProfile.isPending && <Spinner className='mr-2' />}
          Delete
        </Button>
      </div>
    </CustomModal>
  );
}

export function useDeleteAgentProfileModal({
  agentProfile,
  workspaceSlug,
  projectId,
  redirectOnDelete = false
}: {
  agentProfile: AgentProfile;
  workspaceSlug: string;
  projectId: string;
  redirectOnDelete?: boolean;
}) {
  const [showDeleteAgentProfileModal, setShowDeleteAgentProfileModal] =
    useState(false);

  const DeleteAgentProfileModal = useCallback(() => {
    return (
      <DeleteAgentProfileModalHelper
        agentProfile={agentProfile}
        workspaceSlug={workspaceSlug}
        projectId={projectId}
        redirectOnDelete={redirectOnDelete}
        showModal={showDeleteAgentProfileModal}
        setShowModal={setShowDeleteAgentProfileModal}
      />
    );
  }, [
    agentProfile,
    workspaceSlug,
    projectId,
    redirectOnDelete,
    showDeleteAgentProfileModal
  ]);

  return useMemo(
    () => ({ setShowDeleteAgentProfileModal, DeleteAgentProfileModal }),
    [setShowDeleteAgentProfileModal, DeleteAgentProfileModal]
  );
}
