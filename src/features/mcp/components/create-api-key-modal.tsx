'use client';

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
} from 'react';
import { toast } from 'sonner';
import { CustomModal } from '@/components/ui/custom-model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Icons } from '@/components/icons';
import { BASE_URL } from '@/config/url.config';
import { useCreateProjectApiKey } from '../utils/use-project-api-keys';

function CreateApiKeyModalHelper({
  projectId,
  identityId,
  identityName,
  showModal,
  setShowModal
}: {
  projectId: string;
  identityId: string;
  identityName: string;
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [name, setName] = useState('');
  const [secret, setSecret] = useState<string | null>(null);
  const createApiKey = useCreateProjectApiKey(projectId);

  function reset() {
    setName('');
    setSecret(null);
  }

  function handleClose() {
    setShowModal(false);
    reset();
  }

  async function handleCreate() {
    const result = await createApiKey.mutateAsync({
      name,
      mcpIdentityId: identityId
    });
    setSecret(result.secret);
  }

  async function handleCopy() {
    if (!secret) return;
    await navigator.clipboard.writeText(secret);
    toast.success('Copied to clipboard');
  }

  async function handleCopyConfig() {
    if (!secret) return;
    const serverUrl = `${BASE_URL}/api/mcp/${projectId}`;
    const configSnippet = JSON.stringify(
      {
        mcpServers: {
          primiso: {
            type: 'http',
            url: serverUrl,
            headers: {
              Authorization: `Bearer ${secret}`
            }
          }
        }
      },
      null,
      2
    );

    await navigator.clipboard.writeText(configSnippet);
    toast.success('Copied to clipboard');
  }

  return (
    <CustomModal
      showModal={showModal}
      setShowModal={setShowModal}
      onClose={reset}
      preventDefaultClose={!!secret}
      className='sm:max-w-md'
    >
      {secret ? (
        <>
          <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
            <h3 className='text-lg font-medium'>Copy your API key</h3>
            <p className='text-sm text-neutral-500'>
              This is the only time this secret will be shown. Store it
              somewhere safe — you won't be able to view it again.
            </p>
          </div>
          <div className='space-y-4 px-4 py-4 sm:px-6'>
            <div className='bg-muted flex items-center justify-between gap-2 rounded-md border px-3 py-2 font-mono text-sm break-all'>
              {secret}
              <Button
                type='button'
                variant='outline'
                size='icon'
                className='shrink-0'
                onClick={handleCopy}
              >
                <Icons.copy className='size-4' />
              </Button>
            </div>
          </div>
          <div className='flex justify-end gap-2 px-4 py-4 sm:px-6'>
            <Button variant='outline' onClick={handleCopyConfig}>
              <Icons.copy className='mr-2 size-4' />
              Copy config
            </Button>
            <Button onClick={handleClose}>Done</Button>
          </div>
        </>
      ) : (
        <>
          <div className='space-y-2 border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
            <h3 className='text-lg font-medium'>Create API key</h3>
            <p className='text-sm text-neutral-500'>
              For <span className='font-medium'>{identityName}</span> — it will
              see exactly whatever resources this MCP User is currently granted
              in this project.
            </p>
          </div>
          <div className='space-y-2 px-4 py-4 sm:px-6'>
            <Label htmlFor='mcp-key-name'>Name</Label>
            <Input
              id='mcp-key-name'
              placeholder='e.g. Cursor — production'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className='text-muted-foreground text-xs'>
              This key will automatically lock to the first IP address it's used
              from. If that device's IP changes later, you can reset the binding
              from the key's details.
            </p>
          </div>
          <div className='flex justify-end gap-2 border-t border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-600'>
            <Button variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createApiKey.isPending || !name.trim()}
            >
              {createApiKey.isPending && <Spinner className='mr-2' />}
              Create key
            </Button>
          </div>
        </>
      )}
    </CustomModal>
  );
}

export function useCreateApiKeyModal({
  projectId,
  identityId,
  identityName
}: {
  projectId: string;
  identityId: string;
  identityName: string;
}) {
  const [showCreateApiKeyModal, setShowCreateApiKeyModal] = useState(false);

  const CreateApiKeyModal = useCallback(() => {
    return (
      <CreateApiKeyModalHelper
        projectId={projectId}
        identityId={identityId}
        identityName={identityName}
        showModal={showCreateApiKeyModal}
        setShowModal={setShowCreateApiKeyModal}
      />
    );
  }, [projectId, identityId, identityName, showCreateApiKeyModal]);

  return useMemo(
    () => ({ setShowCreateApiKeyModal, CreateApiKeyModal }),
    [setShowCreateApiKeyModal, CreateApiKeyModal]
  );
}
