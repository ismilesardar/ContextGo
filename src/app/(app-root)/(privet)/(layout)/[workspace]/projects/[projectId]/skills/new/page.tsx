import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { PageShell } from '@/components/layout/page-shell';
import { SkillForm } from '@/features/skills/components/skill-form';

export const metadata: Metadata = {
  title: `New Skill - ${APP_NAME}`
};

export default async function NewSkillPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <PageShell
      title='Create skill'
      description='Document project knowledge that humans and AI tools should follow.'
      showDate={false}
      maxWidth='max-w-3xl'
      backHref={`/${workspace}/projects/${projectId}/skills`}
    >
      <SkillForm
        mode='create'
        workspaceSlug={workspace}
        projectId={projectId}
      />
    </PageShell>
  );
}
