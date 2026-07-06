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
  useRevokeProjectApiKey,
  type ProjectApiKey
} from '../utils/use-project-api-keys';

function RevokeApiKeyModalHelper({
  apiKey,
  projectId,
  showModal,
  setShowModal
}: {
  apiKey: ProjectApiKey;
  projectId: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const revokeApiKey = useRevokeProjectApiKey(projectId);

  async function handleRevoke() {
    await revokeApiKey.mutateAsync(apiKey.id, {
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
        <h3 className='text-lg font-medium'>Revoke "{apiKey.name}"?</h3>
        <p className='text-sm text-neutral-500'>
          Any AI client using this key will immediately lose access. This cannot
          be undone — you'll need to create a new key instead.
        </p>
      </div>

      <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
        <Button variant='outline' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant='destructive'
          onClick={handleRevoke}
          disabled={revokeApiKey.isPending}
        >
          {revokeApiKey.isPending && <Spinner className='mr-2' />}
          Revoke
        </Button>
      </div>
    </CustomModal>
  );
}

export function useRevokeApiKeyModal({
  apiKey,
  projectId
}: {
  apiKey: ProjectApiKey;
  projectId: string;
}) {
  const [showRevokeApiKeyModal, setShowRevokeApiKeyModal] = useState(false);

  const RevokeApiKeyModal = useCallback(() => {
    return (
      <RevokeApiKeyModalHelper
        apiKey={apiKey}
        projectId={projectId}
        showModal={showRevokeApiKeyModal}
        setShowModal={setShowRevokeApiKeyModal}
      />
    );
  }, [apiKey, projectId, showRevokeApiKeyModal]);

  return useMemo(
    () => ({ setShowRevokeApiKeyModal, RevokeApiKeyModal }),
    [setShowRevokeApiKeyModal, RevokeApiKeyModal]
  );
}
