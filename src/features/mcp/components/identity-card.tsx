'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { BASE_URL } from '@/config/url.config';
import { createSlug } from '@/utils/create-slug';
import { useEditIdentityGrantsModal } from './edit-identity-grants-modal';
import { useRemoveIdentityModal } from './remove-identity-modal';
import { useCreateApiKeyModal } from './create-api-key-modal';
import { ApiKeysTable } from './api-keys-table';
import type { ProjectMcpIdentity } from '../utils/use-project-mcp-identities';

export function IdentityCard({
  identity,
  projectId,
  canManage
}: {
  identity: ProjectMcpIdentity;
  projectId: string;
  canManage: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const { setShowEditIdentityGrantsModal, EditIdentityGrantsModal } =
    useEditIdentityGrantsModal({ identity, projectId });
  const { setShowRemoveIdentityModal, RemoveIdentityModal } =
    useRemoveIdentityModal({ identity, projectId });
  const { setShowCreateApiKeyModal, CreateApiKeyModal } = useCreateApiKeyModal({
    projectId,
    identityId: identity.id,
    identityName: identity.name
  });

  // Keys are returned newest-first; the most recent non-revoked one is what a
  // freshly granted teammate should actually use.
  const activeKey = identity.apiKeys.find((key) => !key.revokedAt) ?? null;

  async function handleCopyConfig() {
    if (!activeKey) return;
    const serverUrl = `${BASE_URL}/api/mcp/${projectId}`;
    const configSnippet = JSON.stringify(
      {
        mcpServers: {
          [createSlug(identity.name) || 'contextgo']: {
            type: 'http',
            url: serverUrl,
            headers: {
              Authorization: `Bearer ${activeKey.secret ?? '<your-api-key>'}`
            }
          }
        }
      },
      null,
      2
    );

    await navigator.clipboard.writeText(configSnippet);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='space-y-4 rounded-lg border p-4'>
      <EditIdentityGrantsModal />
      <RemoveIdentityModal />
      <CreateApiKeyModal />

      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <Icons.robot className='text-muted-foreground size-4' />
          <span className='font-medium'>{identity.name}</span>
          <Badge variant='secondary'>
            {identity.grants.length} resource
            {identity.grants.length === 1 ? '' : 's'} granted
          </Badge>
        </div>
        {canManage && (
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowEditIdentityGrantsModal(true)}
            >
              Edit resources
            </Button>
            {activeKey ? (
              <Button variant='outline' size='sm' onClick={handleCopyConfig}>
                {copied ? (
                  <Icons.check className='mr-1 size-3.5' />
                ) : (
                  <Icons.copy className='mr-1 size-3.5' />
                )}
                Copy configuration
              </Button>
            ) : (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowCreateApiKeyModal(true)}
              >
                <Icons.add className='mr-1 size-3.5' />
                Create key
              </Button>
            )}
            <Button
              variant='ghost'
              size='icon'
              className='text-destructive size-8'
              onClick={() => setShowRemoveIdentityModal(true)}
              title='Remove from project'
            >
              <Icons.trash className='size-4' />
            </Button>
          </div>
        )}
      </div>

      {identity.apiKeys.length === 0 ? (
        <p className='text-muted-foreground text-sm'>
          No API keys yet for this MCP User in this project.
        </p>
      ) : (
        <ApiKeysTable
          apiKeys={identity.apiKeys}
          projectId={projectId}
          canManage={canManage}
        />
      )}
    </div>
  );
}
