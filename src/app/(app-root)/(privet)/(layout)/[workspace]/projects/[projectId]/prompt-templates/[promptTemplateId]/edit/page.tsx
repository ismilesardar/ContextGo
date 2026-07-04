import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { EditPromptTemplateView } from '@/features/prompt-templates/components/edit-prompt-template-view';

export const metadata: Metadata = {
  title: `Edit Prompt Template - ${APP_NAME}`
};

export default async function EditPromptTemplatePage({
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
    <EditPromptTemplateView
      workspaceSlug={workspace}
      projectId={projectId}
      promptTemplateId={promptTemplateId}
    />
  );
}
