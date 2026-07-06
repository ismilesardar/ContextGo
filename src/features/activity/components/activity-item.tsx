'use client';

import Link from 'next/link';
import type { ProjectActivity } from '../utils/use-project-activities';
import {
  RESOURCE_DETAIL_SEGMENT,
  formatActivityLabel
} from '@/lib/activity/format-activity-label';

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  });
}

export function ActivityItem({
  activity,
  workspaceSlug,
  projectId
}: {
  activity: ProjectActivity;
  workspaceSlug: string;
  projectId: string;
}) {
  const label = formatActivityLabel(activity);
  const segment = activity.resourceType
    ? RESOURCE_DETAIL_SEGMENT[activity.resourceType]
    : undefined;
  const href =
    segment && activity.resourceId
      ? `/${workspaceSlug}/projects/${projectId}/${segment}/${activity.resourceId}`
      : undefined;

  return (
    <div className='flex items-start justify-between gap-4 border-b px-4 py-3 last:border-b-0'>
      <p className='min-w-0 text-sm'>
        <span className='font-medium'>{activity.actorName}</span>{' '}
        <span className='text-muted-foreground'>{label}</span>{' '}
        {activity.resourceTitle &&
          (href ? (
            <Link href={href} className='font-medium hover:underline'>
              "{activity.resourceTitle}"
            </Link>
          ) : (
            <span className='font-medium'>"{activity.resourceTitle}"</span>
          ))}
      </p>
      <span className='text-muted-foreground shrink-0 text-xs'>
        {formatTime(activity.createdAt)}
      </span>
    </div>
  );
}
