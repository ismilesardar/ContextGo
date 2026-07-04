'use client';

import { PageShell } from '@/components/layout/page-shell';
import { useSkillDetail } from '../utils/use-skills';
import { SkillForm } from './skill-form';

export function EditSkillView({
  workspaceSlug,
  projectId,
  skillId
}: {
  workspaceSlug: string;
  projectId: string;
  skillId: string;
}) {
  const {
    data: skill,
    isLoading,
    isError,
    refetch
  } = useSkillDetail(projectId, skillId);

  return (
    <PageShell
      title='Edit content'
      description="Update this skill's content."
      showDate={false}
      maxWidth='max-w-3xl'
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      backHref={`/${workspaceSlug}/projects/${projectId}/skills/${skillId}`}
    >
      {skill && (
        <SkillForm
          mode='edit'
          skill={skill}
          workspaceSlug={workspaceSlug}
          projectId={projectId}
        />
      )}
    </PageShell>
  );
}
