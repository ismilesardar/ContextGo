import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { ChecklistDetailView } from '@/features/checklists/components/checklist-detail-view';

export const metadata: Metadata = {
  title: `Checklist - ${APP_NAME}`
};

export default async function ChecklistDetailPage({
  params
}: {
  params: Promise<{
    workspace: string;
    projectId: string;
    checklistId: string;
  }>;
}) {
  const { workspace, projectId, checklistId } = await params;

  return (
    <ChecklistDetailView
      workspaceSlug={workspace}
      projectId={projectId}
      checklistId={checklistId}
    />
  );
}
