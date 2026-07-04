import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { PageShell } from '@/components/layout/page-shell';
import { ChecklistForm } from '@/features/checklists/components/checklist-form';

export const metadata: Metadata = {
  title: `New Checklist - ${APP_NAME}`
};

export default async function NewChecklistPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <PageShell
      title='Create checklist'
      description='Document project knowledge that humans and AI tools should follow.'
      showDate={false}
      maxWidth='max-w-3xl'
      backHref={`/${workspace}/projects/${projectId}/checklists`}
    >
      <ChecklistForm
        mode='create'
        workspaceSlug={workspace}
        projectId={projectId}
      />
    </PageShell>
  );
}
