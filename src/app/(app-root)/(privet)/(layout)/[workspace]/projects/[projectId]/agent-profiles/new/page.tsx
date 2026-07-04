import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { PageShell } from '@/components/layout/page-shell';
import { AgentProfileForm } from '@/features/agent-profiles/components/agent-profile-form';

export const metadata: Metadata = {
  title: `New Agent Profile - ${APP_NAME}`
};

export default async function NewAgentProfilePage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <PageShell
      title='Create agent profile'
      description='Name the AI role first — you can bundle Instructions, Skills, Prompt Templates, and Checklists into it right after.'
      showDate={false}
      maxWidth='max-w-3xl'
      backHref={`/${workspace}/projects/${projectId}/agent-profiles`}
    >
      <AgentProfileForm
        mode='create'
        workspaceSlug={workspace}
        projectId={projectId}
      />
    </PageShell>
  );
}
