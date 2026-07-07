'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { BASE_URL } from '@/config/url.config';
import { useProject } from '@/features/projects/utils/use-projects';
import { useProjectMcpIdentities } from '../utils/use-project-mcp-identities';
import { useAddIdentityModal } from './add-identity-modal';
import { IdentityCard } from './identity-card';

function ConnectionInstructions({ projectId }: { projectId: string }) {
  const [copied, setCopied] = useState(false);
  const serverUrl = `${BASE_URL}/api/mcp/${projectId}`;

  const configSnippet = JSON.stringify(
    {
      mcpServers: {
        primiso: {
          type: 'http',
          url: serverUrl,
          headers: {
            Authorization: 'Bearer <your-api-key>'
          }
        }
      }
    },
    null,
    2
  );

  async function handleCopy() {
    await navigator.clipboard.writeText(configSnippet);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className='space-y-3 rounded-lg border p-6'>
      <div>
        <h3 className='text-base font-medium'>Connect an AI client</h3>
        <p className='text-muted-foreground text-sm'>
          Add this project as a remote MCP server in Claude Code, Cursor, or any
          other MCP-compatible client. Create an API key for one of the MCP
          Users below, then swap it in for{' '}
          <code className='text-xs'>&lt;your-api-key&gt;</code>.
        </p>
      </div>
      <div className='relative'>
        <pre className='bg-muted overflow-x-auto rounded-md p-4 text-xs'>
          {configSnippet}
        </pre>
        <Button
          variant='outline'
          size='icon'
          className='absolute top-2 right-2'
          onClick={handleCopy}
        >
          {copied ? (
            <Icons.check className='size-4' />
          ) : (
            <Icons.copy className='size-4' />
          )}
        </Button>
      </div>
    </div>
  );
}

export function McpView({
  workspaceSlug,
  projectId
}: {
  workspaceSlug: string;
  projectId: string;
}) {
  const { data: projectData } = useProject(projectId);
  const canManage = projectData?.access?.isOrgAdmin === true;

  const { data: identities, isLoading } = useProjectMcpIdentities(projectId);
  const { setShowAddIdentityModal, AddIdentityModal } = useAddIdentityModal({
    projectId,
    workspaceSlug
  });

  return (
    <PageShell
      title='MCP'
      description="Expose this project's approved knowledge to Claude Code, Cursor, and other AI clients through an MCP server."
      showDate={false}
      actions={
        canManage && (
          <Button onClick={() => setShowAddIdentityModal(true)}>
            <Icons.add className='mr-2 size-4' />
            Add MCP User
          </Button>
        )
      }
    >
      <AddIdentityModal />

      <ConnectionInstructions projectId={projectId} />

      {isLoading ? (
        <p className='text-muted-foreground text-sm'>Loading…</p>
      ) : (identities?.length ?? 0) === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700'>
          <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800'>
            <Icons.robot className='size-6 text-neutral-400' />
          </div>
          <p className='text-muted-foreground text-sm'>
            No MCP Users have been added to this project yet. Add one and pick
            exactly which resources it can see.
          </p>
          {canManage && (
            <Button
              className='mt-4'
              onClick={() => setShowAddIdentityModal(true)}
            >
              <Icons.add className='mr-2 size-4' />
              Add MCP User
            </Button>
          )}
        </div>
      ) : (
        <div className='space-y-4'>
          {identities?.map((identity) => (
            <IdentityCard
              key={identity.id}
              identity={identity}
              projectId={projectId}
              canManage={canManage}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}
