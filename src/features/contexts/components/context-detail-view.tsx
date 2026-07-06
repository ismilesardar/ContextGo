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
import { useContextDetail, usePublishContext } from '../utils/use-contexts';
import { useDeleteContextModal } from './delete-context-modal';
import { useContextDetailsModal } from './context-details-modal';
import { ContextDetailSkeleton } from './context-detail-skeleton';
import { ContextVersionHistoryModal } from './context-version-history-modal';

export function ContextDetailView({
  workspaceSlug,
  projectId,
  contextId
}: {
  workspaceSlug: string;
  projectId: string;
  contextId: string;
}) {
  const {
    data: context,
    isLoading,
    isError,
    refetch
  } = useContextDetail(projectId, contextId);
  const { data: projectData } = useProject(projectId);
  const canManage = projectData?.access?.isOrgAdmin === true;
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const publishContext = usePublishContext(projectId, contextId);
  const { setShowDeleteContextModal, DeleteContextModal } =
    useDeleteContextModal({
      context: context!,
      workspaceSlug,
      projectId,
      redirectOnDelete: true
    });
  const { setShowContextDetailsModal, ContextDetailsModal } =
    useContextDetailsModal({ context: context!, projectId });

  const backHref = `/${workspaceSlug}/projects/${projectId}/contexts`;

  if (isLoading || !context) {
    return (
      <PageShell title='Context' showDate={false} backHref={backHref}>
        <ContextDetailSkeleton />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell
        title='Context'
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
          {context.title}
          {canManage && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-6'
              aria-label='Edit details'
              onClick={() => setShowContextDetailsModal(true)}
            >
              <IconPencil className='size-3.5' />
            </Button>
          )}
        </span>
      }
      description={context.description ?? undefined}
      showDate={false}
      backHref={backHref}
      actions={
        canManage && (
          <div className='flex items-center gap-2'>
            <Button variant='outline' asChild>
              <Link
                href={`/${workspaceSlug}/projects/${projectId}/contexts/${contextId}/edit`}
              >
                Create new version
              </Link>
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                publishContext.mutate(
                  context.status === 'published' ? 'draft' : 'published'
                )
              }
              disabled={publishContext.isPending}
            >
              {context.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              variant='destructive'
              onClick={() => setShowDeleteContextModal(true)}
            >
              Delete
            </Button>
          </div>
        )
      }
    >
      <div className='flex items-center gap-2'>
        {context.status === 'published' ? (
          <Badge variant='outline'>Published</Badge>
        ) : (
          <Badge variant='secondary'>Draft</Badge>
        )}
        <button
          type='button'
          onClick={() => setShowVersionHistory(true)}
          className='text-muted-foreground hover:text-foreground text-xs underline underline-offset-2'
        >
          Version {context.mainVersion?.version ?? context.version} · View
          history
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]'>
        <Card className='min-w-0 rounded-lg p-6'>
          <RichTextViewer content={context.content} />
        </Card>

        <div className='space-y-4'>
          <Card className='rounded-lg p-4'>
            <h3 className='text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase'>
              Metadata
            </h3>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center gap-2'>
                <Avatar className='size-6'>
                  <AvatarImage src={context.createdBy.image ?? undefined} />
                  <AvatarFallback>
                    {context.createdBy.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                  <p className='truncate font-medium'>
                    {context.createdBy.name}
                  </p>
                  <p className='text-muted-foreground text-xs'>Author</p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Status</span>
                <span className='font-medium capitalize'>{context.status}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Created</span>
                <span className='font-medium'>
                  {new Date(context.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Updated</span>
                <span className='font-medium'>
                  {new Date(context.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <DeleteContextModal />
      <ContextDetailsModal />
      <ContextVersionHistoryModal
        projectId={projectId}
        contextId={contextId}
        canManage={canManage}
        showModal={showVersionHistory}
        setShowModal={setShowVersionHistory}
      />
    </PageShell>
  );
}
