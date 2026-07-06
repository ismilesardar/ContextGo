'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useSetMcpIdentityGrants } from '../utils/use-project-mcp-identities';
import type { ProjectMcpIdentity } from '../utils/use-project-mcp-identities';

function RemoveIdentityModalHelper({
  identity,
  projectId,
  showModal,
  setShowModal
}: {
  identity: ProjectMcpIdentity;
  projectId: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const setGrants = useSetMcpIdentityGrants(projectId);

  async function handleRemove() {
    await setGrants.mutateAsync(
      { identityId: identity.id, resources: [] },
      { onSuccess: () => setShowModal(false) }
    );
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-md'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>
          Remove "{identity.name}" from this project?
        </h3>
        <p className='text-sm text-neutral-500'>
          Its resource grants for this project are cleared, and any of its API
          keys here will immediately stop returning any data. The MCP User
          itself, and its access to other projects, is unaffected.
        </p>
      </div>

      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleRemove}
          disabled={setGrants.isPending}
        >
          {setGrants.isPending && <Spinner className='mr-2' />}
          Remove
        </Button>
      </div>
    </CustomModal>
  );
}

export function useRemoveIdentityModal({
  identity,
  projectId
}: {
  identity: ProjectMcpIdentity;
  projectId: string;
}) {
  const [showRemoveIdentityModal, setShowRemoveIdentityModal] = useState(false);

  const RemoveIdentityModal = useCallback(() => {
    return (
      <RemoveIdentityModalHelper
        identity={identity}
        projectId={projectId}
        showModal={showRemoveIdentityModal}
        setShowModal={setShowRemoveIdentityModal}
      />
    );
  }, [identity, projectId, showRemoveIdentityModal]);

  return useMemo(
    () => ({ setShowRemoveIdentityModal, RemoveIdentityModal }),
    [setShowRemoveIdentityModal, RemoveIdentityModal]
  );
}
