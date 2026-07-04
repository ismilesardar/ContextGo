import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { SkillsListView } from '@/features/skills/components/skills-list-view';

export const metadata: Metadata = {
  title: `Skills - ${APP_NAME}`
};

export default async function SkillsPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return <SkillsListView workspaceSlug={workspace} projectId={projectId} />;
}
