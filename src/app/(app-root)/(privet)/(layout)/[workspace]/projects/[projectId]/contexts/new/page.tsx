import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { PageShell } from '@/components/layout/page-shell';
import { ContextForm } from '@/features/contexts/components/context-form';

export const metadata: Metadata = {
  title: `New Context - ${APP_NAME}`
};

export default async function NewContextPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <PageShell
      title='Create context'
      description='Document project knowledge that humans and AI tools should follow.'
      showDate={false}
      maxWidth='max-w-3xl'
      backHref={`/${workspace}/projects/${projectId}/contexts`}
    >
      <ContextForm
        mode='create'
        workspaceSlug={workspace}
        projectId={projectId}
      />
    </PageShell>
  );
}
