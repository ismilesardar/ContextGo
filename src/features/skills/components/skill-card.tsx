'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { SkillActionsMenu } from './skill-actions-menu';
import type { Skill } from '../utils/use-skills';

export function SkillCard({
  skill,
  workspaceSlug,
  projectId,
  canManage
}: {
  skill: Skill;
  workspaceSlug: string;
  projectId: string;
  canManage: boolean;
}) {
  return (
    <Card className='group relative gap-3 rounded-lg transition-colors hover:border-neutral-300 dark:hover:border-neutral-600'>
      <CardHeader className='flex flex-row items-start justify-between gap-2'>
        <Link
          href={`/${workspaceSlug}/projects/${projectId}/skills/${skill.id}`}
          className='flex min-w-0 flex-1 items-start gap-3'
        >
          <div className='bg-accent flex size-9 shrink-0 items-center justify-center rounded-md'>
            <Icons.fileText className='text-accent-foreground size-4' />
          </div>
          <div className='min-w-0'>
            <CardTitle className='truncate text-base font-medium'>
              {skill.title}
            </CardTitle>
            <CardDescription className='truncate text-sm'>
              {skill.description || 'No description'}
            </CardDescription>
          </div>
        </Link>

        {canManage && (
          <SkillActionsMenu
            skill={skill}
            workspaceSlug={workspaceSlug}
            projectId={projectId}
          />
        )}
      </CardHeader>

      <CardContent className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {skill.status === 'published' ? (
            <Badge variant='outline'>Published</Badge>
          ) : (
            <Badge variant='secondary'>Draft</Badge>
          )}
          <span className='text-muted-foreground text-xs'>
            v{skill.mainVersion?.version ?? skill.version}
          </span>
        </div>
        <span className='text-muted-foreground text-xs'>
          Updated {new Date(skill.updatedAt).toLocaleDateString()}
        </span>
      </CardContent>
    </Card>
  );
}
