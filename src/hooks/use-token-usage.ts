'use client';

import { useQuery } from '@tanstack/react-query';

export interface DailyTokenUsage {
  date: string;
  systemTokens: number;
  imageTokens: number;
}

interface TokenUsageResponse {
  entries: DailyTokenUsage[];
}

export function useTokenUsage(workspaceId: string | undefined) {
  return useQuery({
    queryKey: ['token-usage', workspaceId],
    queryFn: async (): Promise<DailyTokenUsage[]> => {
      const res = await fetch('/api/tools/billing/token-usage', {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to fetch token usage');
      }
      const data = (await res.json()) as TokenUsageResponse;
      return data.entries || [];
    },
    enabled: !!workspaceId,
    staleTime: 60_000
  });
}
