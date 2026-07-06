'use client';

import Link from 'next/link';
import { IconInbox } from '@tabler/icons-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  RESOURCE_DETAIL_SEGMENT,
  formatActivityLabel
} from '@/lib/activity/format-activity-label';
import type { RecentActivityItem } from '../utils/use-overview';

function formatTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function RecentActivityList({
  workspaceSlug,
  activity,
  isLoading
}: {
  workspaceSlug: string;
  activity: RecentActivityItem[] | undefined;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>
          Latest updates across your visible projects
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        {isLoading ? (
          <div className='space-y-2 px-6 pb-6'>
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
        ) : !activity || activity.length === 0 ? (
          <div className='flex flex-col items-center justify-center px-6 pb-6 text-center'>
            <div className='bg-muted mb-3 flex size-10 items-center justify-center rounded-full'>
              <IconInbox className='text-muted-foreground size-5' />
            </div>
            <p className='text-muted-foreground text-sm'>
              No activity yet across your projects.
            </p>
          </div>
        ) : (
          <div className='border-t'>
            {activity.map((item) => {
              const label = formatActivityLabel(item);
              const segment = item.resourceType
                ? RESOURCE_DETAIL_SEGMENT[item.resourceType]
                : undefined;
              const href =
                segment && item.resourceType
                  ? `/${workspaceSlug}/projects/${item.projectId}/${segment}`
                  : `/${workspaceSlug}/projects/${item.projectId}/activity`;

              return (
                <div
                  key={item.id}
                  className='flex items-start justify-between gap-4 border-b px-6 py-3 last:border-b-0'
                >
                  <p className='min-w-0 text-sm'>
                    <span className='font-medium'>{item.actorName}</span>{' '}
                    <span className='text-muted-foreground'>{label}</span>{' '}
                    {item.resourceTitle && (
                      <span className='font-medium'>
                        "{item.resourceTitle}"
                      </span>
                    )}{' '}
                    <span className='text-muted-foreground'>in</span>{' '}
                    <Link href={href} className='font-medium hover:underline'>
                      {item.projectName}
                    </Link>
                  </p>
                  <span className='text-muted-foreground shrink-0 text-xs'>
                    {formatTime(item.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
