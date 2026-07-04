'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconPencil } from '@tabler/icons-react';
import { PageShell } from '@/components/layout/page-shell';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RichTextViewer } from '@/components/editor/rich-text-viewer';
import { useProject } from '@/features/projects/utils/use-projects';
import {
  useInstructionDetail,
  usePublishInstruction
} from '../utils/use-instructions';
import { useDeleteInstructionModal } from './delete-instruction-modal';
import { useInstructionDetailsModal } from './instruction-details-modal';
import { InstructionDetailSkeleton } from './instruction-detail-skeleton';
import { InstructionVersionHistoryModal } from './instruction-version-history-modal';

export function InstructionDetailView({
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
  const { data: projectData } = useProject(projectId);
  const canManage = projectData?.access?.isOrgAdmin === true;
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const publishInstruction = usePublishInstruction(projectId, instructionId);
  const { setShowDeleteInstructionModal, DeleteInstructionModal } =
    useDeleteInstructionModal({
      instruction: instruction!,
      workspaceSlug,
      projectId,
      redirectOnDelete: true
    });
  const { setShowInstructionDetailsModal, InstructionDetailsModal } =
    useInstructionDetailsModal({ instruction: instruction!, projectId });

  const backHref = `/${workspaceSlug}/projects/${projectId}/instructions`;

  if (isLoading || !instruction) {
    return (
      <PageShell title='Instruction' showDate={false} backHref={backHref}>
        <InstructionDetailSkeleton />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell
        title='Instruction'
        showDate={false}
        isError
        onRetry={() => refetch()}
        backHref={backHref}
      >
        <div />
      </PageShell>
    );
  }

  return (
    <PageShell
      title={
        <span className='inline-flex items-center gap-2'>
          {instruction.title}
          {canManage && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-6'
              aria-label='Edit details'
              onClick={() => setShowInstructionDetailsModal(true)}
            >
              <IconPencil className='size-3.5' />
            </Button>
          )}
        </span>
      }
      description={instruction.description ?? undefined}
      showDate={false}
      backHref={backHref}
      actions={
        canManage && (
          <div className='flex items-center gap-2'>
            <Button variant='outline' asChild>
              <Link
                href={`/${workspaceSlug}/projects/${projectId}/instructions/${instructionId}/edit`}
              >
                Create new version
              </Link>
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                publishInstruction.mutate(
                  instruction.status === 'published' ? 'draft' : 'published'
                )
              }
              disabled={publishInstruction.isPending}
            >
              {instruction.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              variant='destructive'
              onClick={() => setShowDeleteInstructionModal(true)}
            >
              Delete
            </Button>
          </div>
        )
      }
    >
      <div className='flex items-center gap-2'>
        {instruction.status === 'published' ? (
          <Badge variant='outline'>Published</Badge>
        ) : (
          <Badge variant='secondary'>Draft</Badge>
        )}
        <button
          type='button'
          onClick={() => setShowVersionHistory(true)}
          className='text-muted-foreground hover:text-foreground text-xs underline underline-offset-2'
        >
          Version {instruction.mainVersion?.version ?? instruction.version} ·
          View history
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]'>
        <Card className='rounded-lg p-6'>
          <RichTextViewer content={instruction.content} />
        </Card>

        <div className='space-y-4'>
          <Card className='rounded-lg p-4'>
            <h3 className='text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase'>
              Metadata
            </h3>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center gap-2'>
                <Avatar className='size-6'>
                  <AvatarImage src={instruction.createdBy.image ?? undefined} />
                  <AvatarFallback>
                    {instruction.createdBy.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                  <p className='truncate font-medium'>
                    {instruction.createdBy.name}
                  </p>
                  <p className='text-muted-foreground text-xs'>Author</p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Status</span>
                <span className='font-medium capitalize'>
                  {instruction.status}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Created</span>
                <span className='font-medium'>
                  {new Date(instruction.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Updated</span>
                <span className='font-medium'>
                  {new Date(instruction.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <DeleteInstructionModal />
      <InstructionDetailsModal />
      <InstructionVersionHistoryModal
        projectId={projectId}
        instructionId={instructionId}
        canManage={canManage}
        showModal={showVersionHistory}
        setShowModal={setShowVersionHistory}
      />
    </PageShell>
  );
}
