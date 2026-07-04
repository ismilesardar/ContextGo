'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useDeleteAgentProfileModal } from './delete-agent-profile-modal';
import {
  usePublishAgentProfile,
  type AgentProfile
} from '../utils/use-agent-profiles';

export function AgentProfileActionsMenu({
  agentProfile,
  workspaceSlug,
  projectId
}: {
  agentProfile: AgentProfile;
  workspaceSlug: string;
  projectId: string;
}) {
  const publishAgentProfile = usePublishAgentProfile(
    projectId,
    agentProfile.id
  );
  const { setShowDeleteAgentProfileModal, DeleteAgentProfileModal } =
    useDeleteAgentProfileModal({ agentProfile, workspaceSlug, projectId });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 shrink-0'
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.dots className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem asChild>
            <Link
              href={`/${workspaceSlug}/projects/${projectId}/agent-profiles/${agentProfile.id}`}
            >
              Open
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              publishAgentProfile.mutate(
                agentProfile.status === 'published' ? 'draft' : 'published'
              )
            }
          >
            {agentProfile.status === 'published' ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant='destructive'
            onSelect={() => setShowDeleteAgentProfileModal(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAgentProfileModal />
    </>
  );
}
