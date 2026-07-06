'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import Link from 'next/link';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useMcpIdentities } from '@/features/mcp-identities/utils/use-mcp-identities';
import { useProjectMcpIdentities } from '../utils/use-project-mcp-identities';
import { useSetMcpIdentityGrants } from '../utils/use-project-mcp-identities';
import { McpResourcePicker, type PickedResource } from './mcp-resource-picker';

function AddIdentityModalHelper({
  projectId,
  workspaceSlug,
  showModal,
  setShowModal
}: {
  projectId: string;
  workspaceSlug: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: allIdentities, isLoading: allLoading } = useMcpIdentities();
  const { data: grantedIdentities } = useProjectMcpIdentities(projectId);
  const setGrants = useSetMcpIdentityGrants(projectId);

  const [identityId, setIdentityId] = useState('');
  const [resources, setResources] = useState<PickedResource[]>([]);

  const grantedIds = new Set((grantedIdentities ?? []).map((i) => i.id));
  const availableIdentities = (allIdentities ?? []).filter(
    (i) => !grantedIds.has(i.id)
  );

  function reset() {
    setIdentityId('');
    setResources([]);
  }

  function handleClose() {
    setShowModal(false);
    reset();
  }

  async function handleSave() {
    await setGrants.mutateAsync(
      { identityId, resources },
      { onSuccess: handleClose }
    );
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      onClose={reset}
      className='sm:max-w-2xl'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>Add MCP User to this project</h3>
        <p className='text-sm text-neutral-500'>
          Pick an MCP User and choose exactly which resources it can see here.
        </p>
      </div>
      <div className='max-h-[60vh] space-y-6 overflow-y-auto px-4 py-4 sm:px-6'>
        {!allLoading && availableIdentities.length === 0 ? (
          <p className='text-muted-foreground text-sm'>
            {(allIdentities?.length ?? 0) === 0 ? (
              <>
                No MCP Users exist yet.{' '}
                <Link
                  href={`/${workspaceSlug}/mcp-users`}
                  className='text-foreground underline'
                >
                  Create one
                </Link>{' '}
                first.
              </>
            ) : (
              'Every MCP User has already been added to this project.'
            )}
          </p>
        ) : (
          <>
            <div className='space-y-2'>
              <Label>MCP User</Label>
              <Select value={identityId} onValueChange={setIdentityId}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select an MCP User' />
                </SelectTrigger>
                <SelectContent>
                  {availableIdentities.map((identity) => (
                    <SelectItem key={identity.id} value={identity.id}>
                      {identity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <McpResourcePicker
              projectId={projectId}
              value={resources}
              onChange={setResources}
            />
          </>
        )}
      </div>
      <div className='flex justify-end gap-2 border-t border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <Button variant='outline' onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            setGrants.isPending || !identityId || resources.length === 0
          }
        >
          {setGrants.isPending && <Spinner className='mr-2' />}
          Add to project
        </Button>
      </div>
    </CustomModal>
  );
}

export function useAddIdentityModal({
  projectId,
  workspaceSlug
}: {
  projectId: string;
  workspaceSlug: string;
}) {
  const [showAddIdentityModal, setShowAddIdentityModal] = useState(false);

  const AddIdentityModal = useCallback(() => {
    return (
      <AddIdentityModalHelper
        projectId={projectId}
        workspaceSlug={workspaceSlug}
        showModal={showAddIdentityModal}
        setShowModal={setShowAddIdentityModal}
      />
    );
  }, [projectId, workspaceSlug, showAddIdentityModal]);

  return useMemo(
    () => ({ setShowAddIdentityModal, AddIdentityModal }),
    [setShowAddIdentityModal, AddIdentityModal]
  );
}
