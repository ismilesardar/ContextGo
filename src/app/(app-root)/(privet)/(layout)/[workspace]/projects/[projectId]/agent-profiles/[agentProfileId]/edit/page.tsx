import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { EditAgentProfileView } from '@/features/agent-profiles/components/edit-agent-profile-view';

export const metadata: Metadata = {
  title: `Edit Agent Profile - ${APP_NAME}`
};

export default async function EditAgentProfilePage({
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
    <EditAgentProfileView
      workspaceSlug={workspace}
      projectId={projectId}
      agentProfileId={agentProfileId}
    />
  );
}
