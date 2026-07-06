'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useSetMcpIdentityGrants } from '../utils/use-project-mcp-identities';
import type { ProjectMcpIdentity } from '../utils/use-project-mcp-identities';
import { McpResourcePicker, type PickedResource } from './mcp-resource-picker';

function EditIdentityGrantsModalHelper({
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
  const [resources, setResources] = useState<PickedResource[]>([]);

  useEffect(() => {
    if (showModal) {
      setResources(
        identity.grants.map((g) => ({
          resourceType: g.resourceType,
          resourceId: g.resourceId
        }))
      );
    }
  }, [showModal, identity.grants]);

  async function handleSave() {
    await setGrants.mutateAsync(
      { identityId: identity.id, resources },
      { onSuccess: () => setShowModal(false) }
    );
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-2xl'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>
          Edit resources for "{identity.name}"
        </h3>
        <p className='text-sm text-neutral-500'>
          Changes apply immediately to any existing API keys for this MCP User —
          no need to reissue them.
        </p>
      </div>
      <div className='max-h-[60vh] overflow-y-auto px-4 py-4 sm:px-6'>
        <McpResourcePicker
          projectId={projectId}
          value={resources}
          onChange={setResources}
        />
      </div>
      <div className='flex justify-end gap-2 border-t border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={setGrants.isPending}>
          {setGrants.isPending && <Spinner className='mr-2' />}
          Save
        </Button>
      </div>
    </CustomModal>
  );
}

export function useEditIdentityGrantsModal({
  identity,
  projectId
}: {
  identity: ProjectMcpIdentity;
  projectId: string;
}) {
  const [showEditIdentityGrantsModal, setShowEditIdentityGrantsModal] =
    useState(false);

  const EditIdentityGrantsModal = useCallback(() => {
    return (
      <EditIdentityGrantsModalHelper
        identity={identity}
        projectId={projectId}
        showModal={showEditIdentityGrantsModal}
        setShowModal={setShowEditIdentityGrantsModal}
      />
    );
  }, [identity, projectId, showEditIdentityGrantsModal]);

  return useMemo(
    () => ({ setShowEditIdentityGrantsModal, EditIdentityGrantsModal }),
    [setShowEditIdentityGrantsModal, EditIdentityGrantsModal]
  );
}
