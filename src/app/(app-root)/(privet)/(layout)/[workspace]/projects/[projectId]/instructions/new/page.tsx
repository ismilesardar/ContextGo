import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { PageShell } from '@/components/layout/page-shell';
import { InstructionForm } from '@/features/instructions/components/instruction-form';

export const metadata: Metadata = {
  title: `New Instruction - ${APP_NAME}`
};

export default async function NewInstructionPage({
  params
}: {
  params: Promise<{ workspace: string; projectId: string }>;
}) {
  const { workspace, projectId } = await params;

  return (
    <PageShell
      title='Create instruction'
      description='Document project knowledge that humans and AI tools should follow.'
      showDate={false}
      maxWidth='max-w-3xl'
      backHref={`/${workspace}/projects/${projectId}/instructions`}
    >
      <InstructionForm
        mode='create'
        workspaceSlug={workspace}
        projectId={projectId}
      />
    </PageShell>
  );
}
