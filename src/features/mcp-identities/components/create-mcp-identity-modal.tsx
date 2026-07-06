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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useCreateMcpIdentity } from '../utils/use-mcp-identities';

function CreateMcpIdentityModalHelper({
  showModal,
  setShowModal
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [name, setName] = useState('');
  const createIdentity = useCreateMcpIdentity();

  function handleClose() {
    setShowModal(false);
    setName('');
  }

  async function handleCreate() {
    await createIdentity.mutateAsync(
      { name },
      { onSuccess: () => handleClose() }
    );
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      onClose={() => setName('')}
      className='sm:max-w-md'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>Create MCP User</h3>
        <p className='text-sm text-neutral-500'>
          A named service account with no login of its own — you'll grant it
          access to specific projects and resources, and it surfaces only
          through an MCP API key.
        </p>
      </div>
      <div className='space-y-2 px-4 py-4 sm:px-6'>
        <Label htmlFor='mcp-identity-name'>Name</Label>
        <Input
          id='mcp-identity-name'
          placeholder='e.g. Acme Support Bot'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          disabled={createIdentity.isPending || !name.trim()}
        >
          {createIdentity.isPending && <Spinner className='mr-2' />}
          Create
        </Button>
      </div>
    </CustomModal>
  );
}

export function useCreateMcpIdentityModal() {
  const [showCreateMcpIdentityModal, setShowCreateMcpIdentityModal] =
    useState(false);

  const CreateMcpIdentityModal = useCallback(() => {
    return (
      <CreateMcpIdentityModalHelper
        showModal={showCreateMcpIdentityModal}
        setShowModal={setShowCreateMcpIdentityModal}
      />
    );
  }, [showCreateMcpIdentityModal]);

  return useMemo(
    () => ({ setShowCreateMcpIdentityModal, CreateMcpIdentityModal }),
    [setShowCreateMcpIdentityModal, CreateMcpIdentityModal]
  );
}
