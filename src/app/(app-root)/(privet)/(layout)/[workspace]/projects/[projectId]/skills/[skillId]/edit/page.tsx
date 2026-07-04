import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { EditSkillView } from '@/features/skills/components/edit-skill-view';

export const metadata: Metadata = {
  title: `Edit Skill - ${APP_NAME}`
};

export default async function EditSkillPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string; skillId: string }>;
}) {
  const { workspace, projectId, skillId } = await params;

  return (
    <EditSkillView
      workspaceSlug={workspace}
      projectId={projectId}
      skillId={skillId}
    />
  );
}
