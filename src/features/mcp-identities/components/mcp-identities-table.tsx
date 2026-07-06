'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useDeleteMcpIdentityModal } from './delete-mcp-identity-modal';
import type { McpIdentity } from '../utils/use-mcp-identities';

function DeleteButton({ identity }: { identity: McpIdentity }) {
  const { setShowDeleteMcpIdentityModal, DeleteMcpIdentityModal } =
    useDeleteMcpIdentityModal({ identity });

  return (
    <>
      <DeleteMcpIdentityModal />
      <Button
        variant='ghost'
        size='icon'
        className='text-destructive size-8'
        onClick={() => setShowDeleteMcpIdentityModal(true)}
        title='Delete MCP User'
      >
        <Icons.trash className='size-4' />
      </Button>
    </>
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function McpIdentitiesTable({
  identities
}: {
  identities: McpIdentity[];
}) {
  return (
    <div className='rounded-lg border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Resource grants</TableHead>
            <TableHead>API keys</TableHead>
            <TableHead>Created by</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className='w-12' />
          </TableRow>
        </TableHeader>
        <TableBody>
          {identities.map((identity) => (
            <TableRow key={identity.id}>
              <TableCell className='font-medium'>{identity.name}</TableCell>
              <TableCell className='text-muted-foreground'>
                {identity._count?.grants ?? 0}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {identity._count?.apiKeys ?? 0}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {identity.createdBy.name}
              </TableCell>
              <TableCell className='text-muted-foreground'>
                {formatDate(identity.createdAt)}
              </TableCell>
              <TableCell>
                <DeleteButton identity={identity} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
