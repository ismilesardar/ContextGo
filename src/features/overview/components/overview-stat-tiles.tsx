'use client';

import {
  IconFolder,
  IconLayoutGrid,
  IconRobot,
  IconBooks
} from '@tabler/icons-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { WorkspaceOverviewCounts } from '../utils/use-overview';

function totalResources(counts: WorkspaceOverviewCounts) {
  return (
    counts.contexts +
    counts.instructions +
    counts.skills +
    counts.promptTemplates +
    counts.checklists +
    counts.agentProfiles
  );
}

const TILES = [
  {
    key: 'projects' as const,
    label: 'Projects',
    icon: IconFolder,
    value: (counts: WorkspaceOverviewCounts) => counts.projects
  },
  {
    key: 'resources' as const,
    label: 'Resources',
    icon: IconLayoutGrid,
    value: totalResources
  },
  {
    key: 'mcpUsers' as const,
    label: 'MCP Users',
    icon: IconRobot,
    value: (counts: WorkspaceOverviewCounts) => counts.mcpUsers
  },
  {
    key: 'libraryTemplates' as const,
    label: 'Library Templates',
    icon: IconBooks,
    value: (counts: WorkspaceOverviewCounts) => counts.libraryTemplates
  }
];

export function OverviewStatTiles({
  counts,
  isLoading
}: {
  counts: WorkspaceOverviewCounts | undefined;
  isLoading: boolean;
}) {
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-4'>
      {TILES.map((tile) => (
        <Card key={tile.key}>
          <CardHeader>
            <CardDescription>{tile.label}</CardDescription>
            <CardAction>
              <tile.icon className='text-muted-foreground size-4' />
            </CardAction>
          </CardHeader>
          <CardContent>
            {isLoading || !counts ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <CardTitle className='text-2xl font-semibold tabular-nums'>
                {tile.value(counts).toLocaleString()}
              </CardTitle>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
