'use client';

import Link from 'next/link';
import { PageShell } from '@/components/layout/page-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { useProject } from '@/features/projects/utils/use-projects';
import {
  useAgentProfileDetail,
  usePublishAgentProfile,
  type AgentProfileResourceType
} from '../utils/use-agent-profiles';
import { useDeleteAgentProfileModal } from './delete-agent-profile-modal';
import { AgentProfileDetailSkeleton } from './agent-profile-detail-skeleton';

const RESOURCE_LABELS: Record<AgentProfileResourceType, string> = {
  instruction: 'Instructions',
  skill: 'Skills',
  prompt_template: 'Prompt Templates',
  checklist: 'Checklists',
  context: 'Contexts'
};

const RESOURCE_ROUTE_SEGMENT: Record<AgentProfileResourceType, string> = {
  instruction: 'instructions',
  skill: 'skills',
  prompt_template: 'prompt-templates',
  checklist: 'checklists',
  context: 'contexts'
};

export function AgentProfileDetailView({
  workspaceSlug,
  projectId,
  agentProfileId
}: {
  workspaceSlug: string;
  projectId: string;
  agentProfileId: string;
}) {
  const {
    data: agentProfile,
    isLoading,
    isError,
    refetch
  } = useAgentProfileDetail(projectId, agentProfileId);
  const { data: projectData } = useProject(projectId);
  const canManage = projectData?.access?.isOrgAdmin === true;

  const publishAgentProfile = usePublishAgentProfile(projectId, agentProfileId);
  const { setShowDeleteAgentProfileModal, DeleteAgentProfileModal } =
    useDeleteAgentProfileModal({
      agentProfile: agentProfile!,
      workspaceSlug,
      projectId,
      redirectOnDelete: true
    });

  const backHref = `/${workspaceSlug}/projects/${projectId}/agent-profiles`;

  if (isLoading || !agentProfile) {
    return (
      <PageShell title='Agent Profile' showDate={false} backHref={backHref}>
        <AgentProfileDetailSkeleton />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell
        title='Agent Profile'
        showDate={false}
        isError
        onRetry={() => refetch()}
        backHref={backHref}
      >
        <div />
      </PageShell>
    );
  }

  const resourcesByType = new Map<
    AgentProfileResourceType,
    typeof agentProfile.resources
  >();
  for (const ref of agentProfile.resources) {
    const list = resourcesByType.get(ref.resourceType) ?? [];
    list.push(ref);
    resourcesByType.set(ref.resourceType, list);
  }

  return (
    <PageShell
      title={agentProfile.title}
      description={agentProfile.description ?? undefined}
      showDate={false}
      backHref={backHref}
      actions={
        canManage && (
          <div className='flex items-center gap-2'>
            <Button variant='outline' asChild>
              <Link
                href={`/${workspaceSlug}/projects/${projectId}/agent-profiles/${agentProfileId}/edit`}
              >
                Edit
              </Link>
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                publishAgentProfile.mutate(
                  agentProfile.status === 'published' ? 'draft' : 'published'
                )
              }
              disabled={publishAgentProfile.isPending}
            >
              {agentProfile.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              variant='destructive'
              onClick={() => setShowDeleteAgentProfileModal(true)}
            >
              Delete
            </Button>
          </div>
        )
      }
    >
      <div className='flex items-center gap-2'>
        {agentProfile.status === 'published' ? (
          <Badge variant='outline'>Published</Badge>
        ) : (
          <Badge variant='secondary'>Draft</Badge>
        )}
        <span className='text-muted-foreground text-xs'>
          {agentProfile.resources.length} resource
          {agentProfile.resources.length === 1 ? '' : 's'}
        </span>
      </div>

      {agentProfile.resources.length === 0 ? (
        <Card className='rounded-lg p-6 text-center'>
          <p className='text-muted-foreground text-sm'>
            No resources added yet.
            {canManage &&
              ' Edit this profile to bundle Instructions, Skills, Prompt Templates, or Checklists into it.'}
          </p>
        </Card>
      ) : (
        <div className='space-y-6'>
          {Array.from(resourcesByType.entries()).map(([type, refs]) => (
            <div key={type} className='space-y-2'>
              <h3 className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                {RESOURCE_LABELS[type]}
              </h3>
              <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
                {refs.map((ref) =>
                  ref.resource ? (
                    <Link
                      key={ref.id}
                      href={`/${workspaceSlug}/projects/${projectId}/${RESOURCE_ROUTE_SEGMENT[type]}/${ref.resource.id}`}
                      className='hover:border-neutral-300 dark:hover:border-neutral-600'
                    >
                      <Card className='flex flex-row items-center gap-2 rounded-lg p-3'>
                        <Icons.arrowRight className='text-muted-foreground size-3.5 shrink-0' />
                        <span className='min-w-0 flex-1 truncate text-sm font-medium'>
                          {ref.resource.title}
                        </span>
                        <Badge
                          variant={
                            ref.resource.status === 'published'
                              ? 'outline'
                              : 'secondary'
                          }
                        >
                          {ref.resource.status}
                        </Badge>
                      </Card>
                    </Link>
                  ) : (
                    <Card
                      key={ref.id}
                      className='rounded-lg border-dashed p-3 text-sm'
                    >
                      <span className='text-muted-foreground'>
                        This resource was deleted.
                      </span>
                    </Card>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Card className='rounded-lg p-4'>
        <h3 className='text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase'>
          Metadata
        </h3>
        <div className='flex items-center gap-2'>
          <Avatar className='size-6'>
            <AvatarImage src={agentProfile.createdBy.image ?? undefined} />
            <AvatarFallback>
              {agentProfile.createdBy.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className='min-w-0'>
            <p className='truncate text-sm font-medium'>
              {agentProfile.createdBy.name}
            </p>
            <p className='text-muted-foreground text-xs'>
              Created {new Date(agentProfile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </Card>

      <DeleteAgentProfileModal />
    </PageShell>
  );
}
