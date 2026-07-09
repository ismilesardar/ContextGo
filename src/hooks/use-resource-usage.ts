'use client';

import { useQuery } from '@tanstack/react-query';
import type { ResourceUsageItem } from '@/lib/api/plan/get-workspace-resource-usage';

export function useResourceUsage(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['resource-usage', workspaceId],
    queryFn: async (): Promise<ResourceUsageItem[]> => {
      const res = await fetch('/api/billing/resource-usage', {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch resource usage');
      }
      const data = (await res.json()) as { usage: ResourceUsageItem[] };
      return data.usage || [];
    },
    enabled: !!workspaceId,
    staleTime: 60_000
  });
}
