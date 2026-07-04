import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { AgentProfileDetailView } from '@/features/agent-profiles/components/agent-profile-detail-view';

export const metadata: Metadata = {
  title: `Agent Profile - ${APP_NAME}`
};

export default async function AgentProfileDetailPage({
  params
}: {
  params: Promise<{
    workspace: string;
    projectId: string;
    agentProfileId: string;
  }>;
}) {
  const { workspace, projectId, agentProfileId } = await params;

  return (
    <AgentProfileDetailView
      workspaceSlug={workspace}
      projectId={projectId}
      agentProfileId={agentProfileId}
    />
  );
}
