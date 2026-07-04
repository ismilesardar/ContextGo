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
import { ContextActionsMenu } from './context-actions-menu';
import type { Context } from '../utils/use-contexts';

export function ContextCard({
  context,
  workspaceSlug,
  projectId,
  canManage
}: {
  context: Context;
  workspaceSlug: string;
  projectId: string;
  canManage: boolean;
}) {
  return (
    <Card className='group relative gap-3 rounded-lg transition-colors hover:border-neutral-300 dark:hover:border-neutral-600'>
      <CardHeader className='flex flex-row items-start justify-between gap-2'>
        <Link
          href={`/${workspaceSlug}/projects/${projectId}/contexts/${context.id}`}
          className='flex min-w-0 flex-1 items-start gap-3'
        >
          <div className='bg-accent flex size-9 shrink-0 items-center justify-center rounded-md'>
            <Icons.fileText className='text-accent-foreground size-4' />
          </div>
          <div className='min-w-0'>
            <CardTitle className='truncate text-base font-medium'>
              {context.title}
            </CardTitle>
            <CardDescription className='truncate text-sm'>
              {context.description || 'No description'}
            </CardDescription>
          </div>
        </Link>

        {canManage && (
          <ContextActionsMenu
            context={context}
            workspaceSlug={workspaceSlug}
            projectId={projectId}
          />
        )}
      </CardHeader>

      <CardContent className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          {context.status === 'published' ? (
            <Badge variant='outline'>Published</Badge>
          ) : (
            <Badge variant='secondary'>Draft</Badge>
          )}
          <span className='text-muted-foreground text-xs'>
            v{context.mainVersion?.version ?? context.version}
          </span>
        </div>
        <span className='text-muted-foreground text-xs'>
          Updated {new Date(context.updatedAt).toLocaleDateString()}
        </span>
      </CardContent>
    </Card>
  );
}
