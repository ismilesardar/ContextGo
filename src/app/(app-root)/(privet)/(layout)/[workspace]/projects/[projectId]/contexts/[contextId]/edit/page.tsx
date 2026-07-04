import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { EditContextView } from '@/features/contexts/components/edit-context-view';

export const metadata: Metadata = {
  title: `Edit Context - ${APP_NAME}`
};

export default async function EditContextPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string; contextId: string }>;
}) {
  const { workspace, projectId, contextId } = await params;

  return (
    <EditContextView
      workspaceSlug={workspace}
      projectId={projectId}
      contextId={contextId}
    />
  );
}
