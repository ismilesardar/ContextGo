import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { ChecklistsListView } from '@/features/checklists/components/checklists-list-view';

export const metadata: Metadata = {
  title: `Checklists - ${APP_NAME}`
};

export default async function ChecklistsPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return <ChecklistsListView workspaceSlug={workspace} projectId={projectId} />;
}
