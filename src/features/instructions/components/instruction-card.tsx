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
import { InstructionActionsMenu } from './instruction-actions-menu';
import type { Instruction } from '../utils/use-instructions';

export function InstructionCard({
  instruction,
  workspaceSlug,
  projectId,
  canManage
}: {
  instruction: Instruction;
  workspaceSlug: string;
  projectId: string;
  canManage: boolean;
}) {
  return (
    <Card className='group relative gap-3 rounded-lg transition-colors hover:border-neutral-300 dark:hover:border-neutral-600'>
      <CardHeader className='flex flex-row items-start justify-between gap-2'>
        <Link
          href={`/${workspaceSlug}/projects/${projectId}/instructions/${instruction.id}`}
          className='flex min-w-0 flex-1 items-start gap-3'
        >
          <div className='bg-accent flex size-9 shrink-0 items-center justify-center rounded-md'>
            <Icons.fileText className='text-accent-foreground size-4' />
          </div>
          <div className='min-w-0'>
            <CardTitle className='truncate text-base font-medium'>
              {instruction.title}
            </CardTitle>
            <CardDescription className='truncate text-sm'>
              {instruction.description || 'No description'}
            </CardDescription>
          </div>
        </Link>

        {canManage && (
          <InstructionActionsMenu
            instruction={instruction}
            workspaceSlug={workspaceSlug}
            projectId={projectId}
          />
        )}
      </CardHeader>

      <CardContent className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {instruction.status === 'published' ? (
            <Badge variant='outline'>Published</Badge>
          ) : (
            <Badge variant='secondary'>Draft</Badge>
          )}
          <span className='text-muted-foreground text-xs'>
            v{instruction.mainVersion?.version ?? instruction.version}
          </span>
        </div>
        <span className='text-muted-foreground text-xs'>
          Updated {new Date(instruction.updatedAt).toLocaleDateString()}
        </span>
      </CardContent>
    </Card>
  );
}
