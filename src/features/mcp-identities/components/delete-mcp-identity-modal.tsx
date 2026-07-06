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
import {
  useDeleteMcpIdentity,
  type McpIdentity
} from '../utils/use-mcp-identities';

function DeleteMcpIdentityModalHelper({
  identity,
  showModal,
  setShowModal
}: {
  identity: McpIdentity;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const deleteIdentity = useDeleteMcpIdentity();

  async function handleDelete() {
    await deleteIdentity.mutateAsync(identity.id, {
      onSuccess: () => setShowModal(false)
    });
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      className='sm:max-w-md'
    >
      <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
        <h3 className='text-lg font-medium'>Delete "{identity.name}"?</h3>
        <p className='text-sm text-neutral-500'>
          This permanently removes this MCP User, its access to every project it
          was granted into, and every API key issued for it. Any AI client using
          one of those keys will immediately lose access. This cannot be undone.
        </p>
      </div>

      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleDelete}
          disabled={deleteIdentity.isPending}
        >
          {deleteIdentity.isPending && <Spinner className='mr-2' />}
          Delete
        </Button>
      </div>
    </CustomModal>
  );
}

export function useDeleteMcpIdentityModal({
  identity
}: {
  identity: McpIdentity;
}) {
  const [showDeleteMcpIdentityModal, setShowDeleteMcpIdentityModal] =
    useState(false);

  const DeleteMcpIdentityModal = useCallback(() => {
    return (
      <DeleteMcpIdentityModalHelper
        identity={identity}
        showModal={showDeleteMcpIdentityModal}
        setShowModal={setShowDeleteMcpIdentityModal}
      />
    );
  }, [identity, showDeleteMcpIdentityModal]);

  return useMemo(
    () => ({ setShowDeleteMcpIdentityModal, DeleteMcpIdentityModal }),
    [setShowDeleteMcpIdentityModal, DeleteMcpIdentityModal]
  );
}
