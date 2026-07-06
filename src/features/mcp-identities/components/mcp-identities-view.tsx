'use client';

import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useMcpIdentities } from '../utils/use-mcp-identities';
import { useCreateMcpIdentityModal } from './create-mcp-identity-modal';
import { McpIdentitiesTable } from './mcp-identities-table';

export function McpIdentitiesView() {
  const { data: identities, isLoading } = useMcpIdentities();
  const { setShowCreateMcpIdentityModal, CreateMcpIdentityModal } =
    useCreateMcpIdentityModal();

  return (
    <PageShell
      title='MCP Users'
      description='Service accounts with no login of their own — grant one access to specific projects and resources, then issue it an MCP API key.'
      showDate={false}
      actions={
        <Button onClick={() => setShowCreateMcpIdentityModal(true)}>
          <Icons.add className='mr-2 size-4' />
          Create MCP User
        </Button>
      }
    >
      <CreateMcpIdentityModal />

      {isLoading ? (
        <p className='text-muted-foreground text-sm'>Loading…</p>
      ) : (identities?.length ?? 0) === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700'>
          <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800'>
            <Icons.robot className='size-6 text-neutral-400' />
          </div>
          <p className='text-muted-foreground text-sm'>
            No MCP Users yet. Create one, then grant it access to specific
            projects from each project's MCP tab.
          </p>
          <Button
            className='mt-4'
            onClick={() => setShowCreateMcpIdentityModal(true)}
          >
            <Icons.add className='mr-2 size-4' />
            Create MCP User
          </Button>
        </div>
      ) : (
        <McpIdentitiesTable identities={identities ?? []} />
      )}
    </PageShell>
  );
}
