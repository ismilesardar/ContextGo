'use client';

import { PageShell } from '@/components/layout/page-shell';
import { usePromptTemplateDetail } from '../utils/use-prompt-templates';
import { PromptTemplateForm } from './prompt-template-form';

export function EditPromptTemplateView({
  workspaceSlug,
  projectId,
  promptTemplateId
}: {
  workspaceSlug: string;
  projectId: string;
  promptTemplateId: string;
}) {
  const {
    data: promptTemplate,
    isLoading,
    isError,
    refetch
  } = usePromptTemplateDetail(projectId, promptTemplateId);

  return (
    <PageShell
      title='Edit content'
      description="Update this prompt template's content."
      showDate={false}
      maxWidth='max-w-3xl'
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      backHref={`/${workspaceSlug}/projects/${projectId}/prompt-templates/${promptTemplateId}`}
    >
      {promptTemplate && (
        <PromptTemplateForm
          mode='edit'
          promptTemplate={promptTemplate}
          workspaceSlug={workspaceSlug}
          projectId={projectId}
        />
      )}
    </PageShell>
  );
}
