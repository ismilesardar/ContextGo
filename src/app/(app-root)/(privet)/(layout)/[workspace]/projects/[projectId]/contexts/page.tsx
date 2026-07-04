import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { ContextsListView } from '@/features/contexts/components/contexts-list-view';

export const metadata: Metadata = {
  title: `Contexts - ${APP_NAME}`
};

export default async function ContextsPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return <ContextsListView workspaceSlug={workspace} projectId={projectId} />;
}
