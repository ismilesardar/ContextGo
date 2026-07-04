import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { PageShell } from '@/components/layout/page-shell';
import { PromptTemplateForm } from '@/features/prompt-templates/components/prompt-template-form';

export const metadata: Metadata = {
  title: `New Prompt Template - ${APP_NAME}`
};

export default async function NewPromptTemplatePage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <PageShell
      title='Create promptTemplate'
      description='Document project knowledge that humans and AI tools should follow.'
      showDate={false}
      maxWidth='max-w-3xl'
      backHref={`/${workspace}/projects/${projectId}/prompt-templates`}
    >
      <PromptTemplateForm
        mode='create'
        workspaceSlug={workspace}
        projectId={projectId}
      />
    </PageShell>
  );
}
