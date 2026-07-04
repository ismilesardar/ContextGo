'use client';

import { PageShell } from '@/components/layout/page-shell';
import { useContextDetail } from '../utils/use-contexts';
import { ContextForm } from './context-form';

export function EditContextView({
  workspaceSlug,
  projectId,
  contextId
}: {
  workspaceSlug: string;
  projectId: string;
  contextId: string;
}) {
  const {
    data: context,
    isLoading,
    isError,
    refetch
  } = useContextDetail(projectId, contextId);

  return (
    <PageShell
      title='Edit content'
      description="Update this context's content."
      showDate={false}
      maxWidth='max-w-3xl'
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      backHref={`/${workspaceSlug}/projects/${projectId}/contexts/${contextId}`}
    >
      {context && (
        <ContextForm
          mode='edit'
          context={context}
          workspaceSlug={workspaceSlug}
          projectId={projectId}
        />
      )}
    </PageShell>
  );
}
