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
import { useSkillDetail, usePublishSkill } from '../utils/use-skills';
import { useDeleteSkillModal } from './delete-skill-modal';
import { useSkillDetailsModal } from './skill-details-modal';
import { SkillDetailSkeleton } from './skill-detail-skeleton';
import { SkillVersionHistoryModal } from './skill-version-history-modal';

export function SkillDetailView({
  workspaceSlug,
  projectId,
  skillId
}: {
  workspaceSlug: string;
  projectId: string;
  skillId: string;
}) {
  const {
    data: skill,
    isLoading,
    isError,
    refetch
  } = useSkillDetail(projectId, skillId);
  const { data: projectData } = useProject(projectId);
  const canManage = projectData?.access?.isOrgAdmin === true;
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  const publishSkill = usePublishSkill(projectId, skillId);
  const { setShowDeleteSkillModal, DeleteSkillModal } = useDeleteSkillModal({
    skill: skill!,
    workspaceSlug,
    projectId,
    redirectOnDelete: true
  });
  const { setShowSkillDetailsModal, SkillDetailsModal } = useSkillDetailsModal({
    skill: skill!,
    projectId
  });

  const backHref = `/${workspaceSlug}/projects/${projectId}/skills`;

  if (isLoading || !skill) {
    return (
      <PageShell title='Skill' showDate={false} backHref={backHref}>
        <SkillDetailSkeleton />
      </PageShell>
    );
  }

  if (isError) {
    return (
      <PageShell
        title='Skill'
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
          {skill.title}
          {canManage && (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-6'
              aria-label='Edit details'
              onClick={() => setShowSkillDetailsModal(true)}
            >
              <IconPencil className='size-3.5' />
            </Button>
          )}
        </span>
      }
      description={skill.description ?? undefined}
      showDate={false}
      backHref={backHref}
      actions={
        canManage && (
          <div className='flex items-center gap-2'>
            <Button variant='outline' asChild>
              <Link
                href={`/${workspaceSlug}/projects/${projectId}/skills/${skillId}/edit`}
              >
                Create new version
              </Link>
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                publishSkill.mutate(
                  skill.status === 'published' ? 'draft' : 'published'
                )
              }
              disabled={publishSkill.isPending}
            >
              {skill.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              variant='destructive'
              onClick={() => setShowDeleteSkillModal(true)}
            >
              Delete
            </Button>
          </div>
        )
      }
    >
      <div className='flex items-center gap-2'>
        {skill.status === 'published' ? (
          <Badge variant='outline'>Published</Badge>
        ) : (
          <Badge variant='secondary'>Draft</Badge>
        )}
        <button
          type='button'
          onClick={() => setShowVersionHistory(true)}
          className='text-muted-foreground hover:text-foreground text-xs underline underline-offset-2'
        >
          Version {skill.mainVersion?.version ?? skill.version} · View history
        </button>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]'>
        <Card className='min-w-0 rounded-lg p-6'>
          <RichTextViewer content={skill.content} />
        </Card>

        <div className='space-y-4'>
          <Card className='rounded-lg p-4'>
            <h3 className='text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase'>
              Metadata
            </h3>
            <div className='space-y-3 text-sm'>
              <div className='flex items-center gap-2'>
                <Avatar className='size-6'>
                  <AvatarImage src={skill.createdBy.image ?? undefined} />
                  <AvatarFallback>
                    {skill.createdBy.name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='min-w-0'>
                  <p className='truncate font-medium'>{skill.createdBy.name}</p>
                  <p className='text-muted-foreground text-xs'>Author</p>
                </div>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Status</span>
                <span className='font-medium capitalize'>{skill.status}</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Created</span>
                <span className='font-medium'>
                  {new Date(skill.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-muted-foreground'>Updated</span>
                <span className='font-medium'>
                  {new Date(skill.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <DeleteSkillModal />
      <SkillDetailsModal />
      <SkillVersionHistoryModal
        projectId={projectId}
        skillId={skillId}
        canManage={canManage}
        showModal={showVersionHistory}
        setShowModal={setShowVersionHistory}
      />
    </PageShell>
  );
}
