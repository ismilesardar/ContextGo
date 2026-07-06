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
  useChecklistDetail,
  usePublishChecklist
} from '../utils/use-checklists';
import { useDeleteChecklistModal } from './delete-checklist-modal';
import { useChecklistDetailsModal } from './checklist-details-modal';
import { ChecklistDetailSkeleton } from './checklist-detail-skeleton';
import { ChecklistVersionHistoryModal } from './checklist-version-history-modal';

export function ChecklistDetailView({
  workspaceSlug,
  projectId,
  checklistId
}: {
  workspaceSlug: string;
  projectId: string;
  checklistId: string;
}) {
  const {
    data: checklist,
    isLoading,
    isError,
    refetch
  } = useChecklistDetail(projectId, checklistId);
  const { data: projectData } = useProject(projectId);
  const canManage = projectData?.access?.isOrgAdmin === true;
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const publishChecklist = usePublishChecklist(projectId, checklistId);
  const { setShowDeleteChecklistModal, DeleteChecklistModal } =
    useDeleteChecklistModal({
      checklist: checklist!,
      workspaceSlug,
      projectId,
      redirectOnDelete: true
    });
  const { setShowChecklistDetailsModal, ChecklistDetailsModal } =
    useChecklistDetailsModal({ checklist: checklist!, projectId });

  const backHref = `/${workspaceSlug}/projects/${projectId}/checklists`;

  if (isLoading || !checklist) {
    return (
      <PageShell title='Checklist' showDate={false} backHref={backHref}>
        <ChecklistDetailSkeleton />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell
        title='Checklist'
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
          {checklist.title}
          {canManage && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-6'
              aria-label='Edit details'
              onClick={() => setShowChecklistDetailsModal(true)}
            >
              <IconPencil className='size-3.5' />
            </Button>
          )}
        </span>
      }
      description={checklist.description ?? undefined}
      showDate={false}
      backHref={backHref}
      actions={
        canManage && (
          <div className='flex items-center gap-2'>
            <Button variant='outline' asChild>
              <Link
                href={`/${workspaceSlug}/projects/${projectId}/checklists/${checklistId}/edit`}
              >
                Create new version
              </Link>
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                publishChecklist.mutate(
                  checklist.status === 'published' ? 'draft' : 'published'
                )
              }
              disabled={publishChecklist.isPending}
            >
              {checklist.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              variant='destructive'
              onClick={() => setShowDeleteChecklistModal(true)}
            >
              Delete
            </Button>
          </div>
        )
      }
    >
      <div className='flex items-center gap-2'>
        {checklist.status === 'published' ? (
          <Badge variant='outline'>Published</Badge>
        ) : (
          <Badge variant='secondary'>Draft</Badge>
        )}
        <button
          type='button'
          onClick={() => setShowVersionHistory(true)}
          className='text-muted-foreground hover:text-foreground text-xs underline underline-offset-2'
        >
          Version {checklist.mainVersion?.version ?? checklist.version} · View
          history
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]'>
        <Card className='min-w-0 rounded-lg p-6'>
          <RichTextViewer content={checklist.content} />
        </Card>

        <div className='space-y-4'>
          <Card className='rounded-lg p-4'>
            <h3 className='text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase'>
              Metadata
            </h3>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center gap-2'>
                <Avatar className='size-6'>
                  <AvatarImage src={checklist.createdBy.image ?? undefined} />
                  <AvatarFallback>
                    {checklist.createdBy.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                  <p className='truncate font-medium'>
                    {checklist.createdBy.name}
                  </p>
                  <p className='text-muted-foreground text-xs'>Author</p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Status</span>
                <span className='font-medium capitalize'>
                  {checklist.status}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Created</span>
                <span className='font-medium'>
                  {new Date(checklist.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Updated</span>
                <span className='font-medium'>
                  {new Date(checklist.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <DeleteChecklistModal />
      <ChecklistDetailsModal />
      <ChecklistVersionHistoryModal
        projectId={projectId}
        checklistId={checklistId}
        canManage={canManage}
        showModal={showVersionHistory}
        setShowModal={setShowVersionHistory}
      />
    </PageShell>
  );
}
