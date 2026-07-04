import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { AgentProfilesListView } from '@/features/agent-profiles/components/agent-profiles-list-view';

export const metadata: Metadata = {
  title: `Agent Profiles - ${APP_NAME}`
};

export default async function AgentProfilesPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <AgentProfilesListView workspaceSlug={workspace} projectId={projectId} />
  );
}
