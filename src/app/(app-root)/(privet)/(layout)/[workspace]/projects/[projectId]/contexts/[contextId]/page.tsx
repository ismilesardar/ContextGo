import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { ContextDetailView } from '@/features/contexts/components/context-detail-view';

export const metadata: Metadata = {
  title: `Context - ${APP_NAME}`
};

export default async function ContextDetailPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string; contextId: string }>;
}) {
  const { workspace, projectId, contextId } = await params;

  return (
    <ContextDetailView
      workspaceSlug={workspace}
      projectId={projectId}
      contextId={contextId}
    />
  );
}
