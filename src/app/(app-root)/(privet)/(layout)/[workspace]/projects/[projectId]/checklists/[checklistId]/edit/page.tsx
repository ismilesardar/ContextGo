import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { EditChecklistView } from '@/features/checklists/components/edit-checklist-view';

export const metadata: Metadata = {
  title: `Edit Checklist - ${APP_NAME}`
};

export default async function EditChecklistPage({
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
    <EditChecklistView
      workspaceSlug={workspace}
      projectId={projectId}
      checklistId={checklistId}
    />
  );
}
