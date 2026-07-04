'use client';

import { PageShell } from '@/components/layout/page-shell';
import { useChecklistDetail } from '../utils/use-checklists';
import { ChecklistForm } from './checklist-form';

export function EditChecklistView({
  workspaceSlug,
  projectId,
  checklistId
}: {
  workspaceSlug: string;
  projectId: string;
  checklistId: string;
}) {
  const {
    data: checklist,
    isLoading,
    isError,
    refetch
  } = useChecklistDetail(projectId, checklistId);

  return (
    <PageShell
      title='Edit content'
      description="Update this checklist's content."
      showDate={false}
      maxWidth='max-w-3xl'
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      backHref={`/${workspaceSlug}/projects/${projectId}/checklists/${checklistId}`}
    >
      {checklist && (
        <ChecklistForm
          mode='edit'
          checklist={checklist}
          workspaceSlug={workspaceSlug}
          projectId={projectId}
        />
      )}
    </PageShell>
  );
}
