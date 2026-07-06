'use client';

import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/api-setting/axios.config';

export interface ActivitySummary {
  total: number;
  topResourceType: { type: string; count: number } | null;
  topActor: { name: string; count: number } | null;
}

export function useActivitySummary(projectId: string | undefined) {
  return useQuery({
    queryKey: ['project-activity-summary', projectId],
    queryFn: async () => {
      const data = await axios.get<ActivitySummary, ActivitySummary>(
        `/api/projects/${projectId}/activity/summary`
      );
      return data;
    },
    enabled: !!projectId
  });
}
