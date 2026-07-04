import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { PromptTemplateDetailView } from '@/features/prompt-templates/components/prompt-template-detail-view';

export const metadata: Metadata = {
  title: `Prompt Template - ${APP_NAME}`
};

export default async function PromptTemplateDetailPage({
  params
}: {
  params: Promise<{
    workspace: string;
    projectId: string;
    promptTemplateId: string;
  }>;
}) {
  const { workspace, projectId, promptTemplateId } = await params;

  return (
    <PromptTemplateDetailView
      workspaceSlug={workspace}
      projectId={projectId}
      promptTemplateId={promptTemplateId}
    />
  );
}
