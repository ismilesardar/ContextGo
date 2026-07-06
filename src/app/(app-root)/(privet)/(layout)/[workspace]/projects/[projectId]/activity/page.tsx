import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { ActivityView } from '@/features/activity/components/activity-view';

export const metadata: Metadata = {
  title: `Activity - ${APP_NAME}`
};

export default async function ActivityPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return <ActivityView workspaceSlug={workspace} projectId={projectId} />;
}
