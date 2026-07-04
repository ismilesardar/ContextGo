import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { EditInstructionView } from '@/features/instructions/components/edit-instruction-view';

export const metadata: Metadata = {
  title: `Edit Instruction - ${APP_NAME}`
};

export default async function EditInstructionPage({
  params
}: {
  params: Promise<{
    workspace: string;
    projectId: string;
    instructionId: string;
  }>;
}) {
  const { workspace, projectId, instructionId } = await params;

  return (
    <EditInstructionView
      workspaceSlug={workspace}
      projectId={projectId}
      instructionId={instructionId}
    />
  );
}
