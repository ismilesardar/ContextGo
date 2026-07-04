import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { SkillDetailView } from '@/features/skills/components/skill-detail-view';

export const metadata: Metadata = {
  title: `Skill - ${APP_NAME}`
};

export default async function SkillDetailPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string; skillId: string }>;
}) {
  const { workspace, projectId, skillId } = await params;

  return (
    <SkillDetailView
      workspaceSlug={workspace}
      projectId={projectId}
      skillId={skillId}
    />
  );
}
