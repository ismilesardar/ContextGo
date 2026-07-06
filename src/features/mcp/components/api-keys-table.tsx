'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useRevokeApiKeyModal } from './revoke-api-key-modal';
import type { ProjectApiKey } from '../utils/use-project-api-keys';

function RevokeButton({
  apiKey,
  projectId
}: {
  apiKey: ProjectApiKey;
  projectId: string;
}) {
  const { setShowRevokeApiKeyModal, RevokeApiKeyModal } = useRevokeApiKeyModal({
    apiKey,
    projectId
  });

  return (
    <>
      <RevokeApiKeyModal />
      <Button
        variant='ghost'
        size='icon'
        className='text-destructive size-8'
        onClick={() => setShowRevokeApiKeyModal(true)}
        title='Revoke key'
      >
        <Icons.trash className='size-4' />
      </Button>
    </>
  );
}

function formatDate(value: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function ApiKeysTable({
  apiKeys,
  projectId,
  canManage
}: {
  apiKeys: ProjectApiKey[];
  projectId: string;
  canManage: boolean;
}) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last used</TableHead>
            <TableHead>Status</TableHead>
            {canManage && <TableHead className='w-12' />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell className='font-medium'>{apiKey.name}</TableCell>
              <TableCell className='text-muted-foreground font-mono text-xs'>
                {apiKey.keyPrefix}…
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {formatDate(apiKey.createdAt)}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {formatDate(apiKey.lastUsedAt)}
              </TableCell>
              <TableCell>
                {apiKey.revokedAt ? (
                  <Badge variant='secondary'>Revoked</Badge>
                ) : (
                  <Badge variant='outline'>Active</Badge>
                )}
              </TableCell>
              {canManage && (
                <TableCell>
                  {!apiKey.revokedAt && (
                    <RevokeButton apiKey={apiKey} projectId={projectId} />
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
