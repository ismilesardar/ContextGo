'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { axios } from '@/lib/api-setting/axios.config';

export interface ProjectActivity {
  id: string;
  projectId: string;
  actorId: string;
  actorName: string;
  action: string;
  resourceType: string | null;
  resourceId: string | null;
  resourceTitle: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface UseProjectActivitiesFilters {
  resourceType?: string;
  action?: string;
}

export function useProjectActivities(
  projectId: string | undefined,
  filters: UseProjectActivitiesFilters = {}
) {
  return useInfiniteQuery({
    queryKey: [
      'project-activities',
      projectId,
      filters.resourceType,
      filters.action
    ],
    queryFn: async ({ pageParam }: { pageParam: string | null }) => {
      const data = await axios.get<
        { activities: ProjectActivity[]; nextCursor: string | null },
        { activities: ProjectActivity[]; nextCursor: string | null }
      >(`/api/projects/${projectId}/activity`, {
        params: {
          resourceType: filters.resourceType,
          action: filters.action,
          cursor: pageParam ?? undefined
        }
      });
      return data;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!projectId
  });
}
