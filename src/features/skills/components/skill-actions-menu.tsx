'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useDeleteSkillModal } from './delete-skill-modal';
import { usePublishSkill, type Skill } from '../utils/use-skills';

export function SkillActionsMenu({
  skill,
  workspaceSlug,
  projectId
}: {
  skill: Skill;
  workspaceSlug: string;
  projectId: string;
}) {
  const publishSkill = usePublishSkill(projectId, skill.id);
  const { setShowDeleteSkillModal, DeleteSkillModal } = useDeleteSkillModal({
    skill,
    workspaceSlug,
    projectId
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='size-8 shrink-0'
            onClick={(e) => e.stopPropagation()}
          >
            <Icons.dots className='size-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem asChild>
            <Link
              href={`/${workspaceSlug}/projects/${projectId}/skills/${skill.id}`}
            >
              Open
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              publishSkill.mutate(
                skill.status === 'published' ? 'draft' : 'published'
              )
            }
          >
            {skill.status === 'published' ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
          <DropdownMenuItem
            variant='destructive'
            onSelect={() => setShowDeleteSkillModal(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteSkillModal />
    </>
  );
}
