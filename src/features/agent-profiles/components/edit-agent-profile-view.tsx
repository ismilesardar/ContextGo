'use client';

import { PageShell } from '@/components/layout/page-shell';
import { useAgentProfileDetail } from '../utils/use-agent-profiles';
import { AgentProfileForm } from './agent-profile-form';

export function EditAgentProfileView({
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

  return (
    <PageShell
      title='Edit agent profile'
      description="Update this agent profile's details and the resources it bundles."
      showDate={false}
      maxWidth='max-w-5xl'
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      backHref={`/${workspaceSlug}/projects/${projectId}/agent-profiles/${agentProfileId}`}
    >
      {agentProfile && (
        <AgentProfileForm
          mode='edit'
          agentProfile={agentProfile}
          workspaceSlug={workspaceSlug}
          projectId={projectId}
        />
      )}
    </PageShell>
  );
}
