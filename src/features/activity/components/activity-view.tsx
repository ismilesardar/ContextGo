'use client';

import { useMemo, useState } from 'react';
import {
  IconAlertCircle,
  IconDownload,
  IconInbox,
  IconRefresh
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { APP_NAME } from '@/config/url.config';
import { axios } from '@/lib/api-setting/axios.config';
import { useProject } from '@/features/projects/utils/use-projects';
import { useProjectActivities } from '../utils/use-project-activities';
import { useActivitySummary } from '../utils/use-activity-summary';
import { ActivityItem } from './activity-item';

type ResourceTypeFilter = 'all' | string;

const RESOURCE_TYPE_OPTIONS: { value: ResourceTypeFilter; label: string }[] = [
  { value: 'all', label: 'All resources' },
  { value: 'context', label: 'Contexts' },
  { value: 'instruction', label: 'Instructions' },
  { value: 'skill', label: 'Skills' },
  { value: 'prompt_template', label: 'Prompt Templates' },
  { value: 'checklist', label: 'Checklists' },
  { value: 'agent_profile', label: 'Agent Profiles' },
  { value: 'project', label: 'Project' },
  { value: 'project_member', label: 'Members' },
  { value: 'mcp_key', label: 'API keys' }
];

function formatDayHeading(dateKey: string) {
  const date = new Date(dateKey);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function ActivityView({
  workspaceSlug,
  projectId
}: {
  workspaceSlug: string;
  projectId: string;
}) {
  const [resourceType, setResourceType] = useState<ResourceTypeFilter>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: projectData } = useProject(projectId);
  const canManage = projectData?.access?.isOrgAdmin === true;

  const { data: summary, isLoading: isSummaryLoading } =
    useActivitySummary(projectId);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useProjectActivities(projectId, {
    resourceType: resourceType === 'all' ? undefined : resourceType
  });

  const handleDownload = async () => {
    setIsDownloading(true);
    const toastId = toast.loading('Preparing export...');

    try {
      const response = await axios.get(
        `/api/projects/${projectId}/activity/export`,
        { responseType: 'blob' }
      );
      const blob = (response as any).data as Blob;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${APP_NAME} Activity Export - ${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Activity exported', { id: toastId });
    } catch {
      toast.error('Failed to export activity', { id: toastId });
    } finally {
      setIsDownloading(false);
    }
  };

  const activities = useMemo(
    () => data?.pages.flatMap((page) => page.activities) ?? [],
    [data]
  );

  const groups = useMemo(() => {
    const map = new Map<string, typeof activities>();
    for (const activity of activities) {
      const dayKey = new Date(activity.createdAt).toDateString();
      const list = map.get(dayKey) ?? [];
      list.push(activity);
      map.set(dayKey, list);
    }
    return Array.from(map.entries());
  }, [activities]);

  return (
    <PageShell
      title='Activity'
      description="This project's activity timeline — resource updates, member changes, and audit events."
      showDate={false}
      actions={
        canManage ? (
          <Button
            variant='outline'
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Spinner className='mr-2' />
            ) : (
              <IconDownload className='mr-2 size-4' />
            )}
            Download CSV
          </Button>
        ) : undefined
      }
    >
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
        {isSummaryLoading ? (
          <>
            <Skeleton className='h-24 rounded-xl' />
            <Skeleton className='h-24 rounded-xl' />
            <Skeleton className='h-24 rounded-xl' />
          </>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardDescription>Total activities</CardDescription>
                <CardTitle className='text-2xl font-semibold tabular-nums'>
                  {summary?.total ?? '—'}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Most active resource</CardDescription>
                <CardTitle className='text-2xl font-semibold'>
                  {summary?.topResourceType?.type ?? '—'}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Most active member</CardDescription>
                <CardTitle className='text-2xl font-semibold'>
                  {summary?.topActor?.name ?? '—'}
                </CardTitle>
              </CardHeader>
            </Card>
          </>
        )}
      </div>

      <div className='flex items-center justify-between'>
        <Select
          value={resourceType}
          onValueChange={(value) => setResourceType(value)}
        >
          <SelectTrigger className='w-48'>
            <SelectValue placeholder='Resource type' />
          </SelectTrigger>
          <SelectContent>
            {RESOURCE_TYPE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/80 p-16 text-center dark:border-red-900 dark:bg-red-950/50'>
          <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50'>
            <IconAlertCircle className='size-6 text-red-600 dark:text-red-400' />
          </div>
          <p className='text-foreground text-lg font-semibold'>
            Unable to load
          </p>
          <p className='text-muted-foreground mt-1.5 text-sm'>
            Something went wrong. Please try again.
          </p>
          <Button onClick={() => refetch()} variant='outline' className='mt-5'>
            <IconRefresh className='mr-2 size-4' />
            Try again
          </Button>
        </div>
      ) : isLoading ? (
        <p className='text-muted-foreground text-sm'>Loading…</p>
      ) : groups.length === 0 ? (
        <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 p-16 text-center dark:border-neutral-700'>
          <div className='mb-3 flex size-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800'>
            <IconInbox className='size-6 text-neutral-400' />
          </div>
          <p className='text-muted-foreground text-sm'>
            No activity yet. Changes to this project's resources will show up
            here.
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          {groups.map(([dayKey, dayActivities]) => (
            <div key={dayKey} className='space-y-2'>
              <h3 className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                {formatDayHeading(dayKey)}
              </h3>
              <div className='rounded-lg border'>
                {dayActivities.map((activity) => (
                  <ActivityItem
                    key={activity.id}
                    activity={activity}
                    workspaceSlug={workspaceSlug}
                    projectId={projectId}
                  />
                ))}
              </div>
            </div>
          ))}

          {hasNextPage && (
            <div className='flex justify-center'>
              <Button
                variant='outline'
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && <Spinner className='mr-2' />}
                Load more
              </Button>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
