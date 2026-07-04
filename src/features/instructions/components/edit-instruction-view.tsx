'use client';

import { PageShell } from '@/components/layout/page-shell';
import { useInstructionDetail } from '../utils/use-instructions';
import { InstructionForm } from './instruction-form';

export function EditInstructionView({
  workspaceSlug,
  projectId,
  instructionId
}: {
  workspaceSlug: string;
  projectId: string;
  instructionId: string;
}) {
  const {
    data: instruction,
    isLoading,
    isError,
    refetch
  } = useInstructionDetail(projectId, instructionId);

  return (
    <PageShell
      title='Edit content'
      description="Update this instruction's content."
      showDate={false}
      maxWidth='max-w-3xl'
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      backHref={`/${workspaceSlug}/projects/${projectId}/instructions/${instructionId}`}
    >
      {instruction && (
        <InstructionForm
          mode='edit'
          instruction={instruction}
          workspaceSlug={workspaceSlug}
          projectId={projectId}
        />
      )}
    </PageShell>
  );
}
