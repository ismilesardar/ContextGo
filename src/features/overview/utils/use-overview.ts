'use client';

import { useQuery } from '@tanstack/react-query';
import { axios } from '@/lib/api-setting/axios.config';
import { useWorkspaceStore } from '@/store';

export interface WorkspaceOverviewCounts {
  projects: number;
  contexts: number;
  instructions: number;
  skills: number;
  promptTemplates: number;
  checklists: number;
  agentProfiles: number;
  mcpUsers: number;
  libraryTemplates: number;
}

export interface ResourceBreakdownItem {
  type: string;
  label: string;
  count: number;
}

export interface ActivityTrendPoint {
  date: string;
  count: number;
}

export interface RecentActivityItem {
  id: string;
  action: string;
  resourceType: string | null;
  resourceTitle: string | null;
  actorName: string;
  createdAt: string;
  projectId: string;
  projectName: string;
}

export interface WorkspaceOverview {
  counts: WorkspaceOverviewCounts;
  resourceBreakdown: ResourceBreakdownItem[];
  activityTrend: ActivityTrendPoint[];
  recentActivity: RecentActivityItem[];
}

export function useOverview() {
  const { activeWorkspace } = useWorkspaceStore((state) => state);

  return useQuery({
    queryKey: ['workspace-overview', activeWorkspace?.id],
    queryFn: async () => {
      const data = await axios.get<WorkspaceOverview, WorkspaceOverview>(
        '/api/overview'
      );
      return data;
    },
    enabled: !!activeWorkspace?.id
  });
}
