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
  usePromptTemplateDetail,
  usePublishPromptTemplate
} from '../utils/use-prompt-templates';
import { useDeletePromptTemplateModal } from './delete-prompt-template-modal';
import { usePromptTemplateDetailsModal } from './prompt-template-details-modal';
import { PromptTemplateDetailSkeleton } from './prompt-template-detail-skeleton';
import { PromptTemplateVersionHistoryModal } from './prompt-template-version-history-modal';

export function PromptTemplateDetailView({
  workspaceSlug,
  projectId,
  promptTemplateId
}: {
  workspaceSlug: string;
  projectId: string;
  promptTemplateId: string;
}) {
  const {
    data: promptTemplate,
    isLoading,
    isError,
    refetch
  } = usePromptTemplateDetail(projectId, promptTemplateId);
  const { data: projectData } = useProject(projectId);
  const canManage = projectData?.access?.isOrgAdmin === true;
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const publishPromptTemplate = usePublishPromptTemplate(
    projectId,
    promptTemplateId
  );
  const { setShowDeletePromptTemplateModal, DeletePromptTemplateModal } =
    useDeletePromptTemplateModal({
      promptTemplate: promptTemplate!,
      workspaceSlug,
      projectId,
      redirectOnDelete: true
    });
  const { setShowPromptTemplateDetailsModal, PromptTemplateDetailsModal } =
    usePromptTemplateDetailsModal({
      promptTemplate: promptTemplate!,
      projectId
    });

  const backHref = `/${workspaceSlug}/projects/${projectId}/prompt-templates`;

  if (isLoading || !promptTemplate) {
    return (
      <PageShell title='Prompt Template' showDate={false} backHref={backHref}>
        <PromptTemplateDetailSkeleton />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell
        title='Prompt Template'
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
          {promptTemplate.title}
          {canManage && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-6'
              aria-label='Edit details'
              onClick={() => setShowPromptTemplateDetailsModal(true)}
            >
              <IconPencil className='size-3.5' />
            </Button>
          )}
        </span>
      }
      description={promptTemplate.description ?? undefined}
      showDate={false}
      backHref={backHref}
      actions={
        canManage && (
          <div className='flex items-center gap-2'>
            <Button variant='outline' asChild>
              <Link
                href={`/${workspaceSlug}/projects/${projectId}/prompt-templates/${promptTemplateId}/edit`}
              >
                Create new version
              </Link>
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                publishPromptTemplate.mutate(
                  promptTemplate.status === 'published' ? 'draft' : 'published'
                )
              }
              disabled={publishPromptTemplate.isPending}
            >
              {promptTemplate.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              variant='destructive'
              onClick={() => setShowDeletePromptTemplateModal(true)}
            >
              Delete
            </Button>
          </div>
        )
      }
    >
      <div className='flex items-center gap-2'>
        {promptTemplate.status === 'published' ? (
          <Badge variant='outline'>Published</Badge>
        ) : (
          <Badge variant='secondary'>Draft</Badge>
        )}
        <button
          type='button'
          onClick={() => setShowVersionHistory(true)}
          className='text-muted-foreground hover:text-foreground text-xs underline underline-offset-2'
        >
          Version{' '}
          {promptTemplate.mainVersion?.version ?? promptTemplate.version} · View
          history
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]'>
        <Card className='rounded-lg p-6'>
          <RichTextViewer content={promptTemplate.content} />
        </Card>

        <div className='space-y-4'>
          <Card className='rounded-lg p-4'>
            <h3 className='text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase'>
              Metadata
            </h3>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center gap-2'>
                <Avatar className='size-6'>
                  <AvatarImage
                    src={promptTemplate.createdBy.image ?? undefined}
                  />
                  <AvatarFallback>
                    {promptTemplate.createdBy.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                  <p className='truncate font-medium'>
                    {promptTemplate.createdBy.name}
                  </p>
                  <p className='text-muted-foreground text-xs'>Author</p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Status</span>
                <span className='font-medium capitalize'>
                  {promptTemplate.status}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Created</span>
                <span className='font-medium'>
                  {new Date(promptTemplate.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Updated</span>
                <span className='font-medium'>
                  {new Date(promptTemplate.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <DeletePromptTemplateModal />
      <PromptTemplateDetailsModal />
      <PromptTemplateVersionHistoryModal
        projectId={projectId}
        promptTemplateId={promptTemplateId}
        canManage={canManage}
        showModal={showVersionHistory}
        setShowModal={setShowVersionHistory}
      />
    </PageShell>
  );
}
