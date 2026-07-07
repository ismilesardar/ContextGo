'use client';

import { useParams } from 'next/navigation';
import { useUserSession } from '@/hooks/use-client-session';
import { PageShell } from '@/components/layout/page-shell';
import { useOverview } from '../utils/use-overview';
import { OverviewStatTiles } from './overview-stat-tiles';
import { ResourceBreakdownChart } from './resource-breakdown-chart';
import { ActivityTrendChart } from './activity-trend-chart';
import { McpRequestTrendChart } from './mcp-request-trend-chart';
import { RecentActivityList } from './recent-activity-list';

export default function UnifiedOverviewView() {
  const { user } = useUserSession();
  const params = useParams();
  const workspaceSlug = (params?.workspace as string) ?? '';

  const firstName = user?.name?.split(' ')[0] || 'there';
  const { data, isLoading } = useOverview();

  return (
    <PageShell
      title={`Welcome back, ${firstName}`}
      description='This is your workspace overview.'
    >
      <OverviewStatTiles counts={data?.counts} isLoading={isLoading} />

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <ActivityTrendChart data={data?.activityTrend} isLoading={isLoading} />
        <ResourceBreakdownChart
          data={data?.resourceBreakdown}
          isLoading={isLoading}
        />
      </div>

      <McpRequestTrendChart
        data={data?.mcpRequestTrend}
        isLoading={isLoading}
      />

      <RecentActivityList
        workspaceSlug={workspaceSlug}
        activity={data?.recentActivity}
        isLoading={isLoading}
      />
    </PageShell>
  );
}
