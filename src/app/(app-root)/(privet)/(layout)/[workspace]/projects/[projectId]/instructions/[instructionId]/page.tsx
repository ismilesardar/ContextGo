import type { Metadata } from 'next';
import { APP_NAME } from '@/config/url.config';
import { InstructionDetailView } from '@/features/instructions/components/instruction-detail-view';

export const metadata: Metadata = {
  title: `Instruction - ${APP_NAME}`
};

export default async function InstructionDetailPage({
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
    <InstructionDetailView
      workspaceSlug={workspace}
      projectId={projectId}
      instructionId={instructionId}
    />
  );
}
