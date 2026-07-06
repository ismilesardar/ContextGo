'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { ResourceBreakdownItem } from '../utils/use-overview';

const chartConfig = {
  count: {
    label: 'Resources',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function ResourceBreakdownChart({
  data,
  isLoading
}: {
  data: ResourceBreakdownItem[] | undefined;
  isLoading: boolean;
}) {
  const hasData = !!data && data.some((item) => item.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources by type</CardTitle>
        <CardDescription>
          Contexts, Instructions, Skills, Prompt Templates, Checklists, and
          Agent Profiles across your visible projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-[250px] w-full' />
        ) : !hasData ? (
          <div className='text-muted-foreground flex h-[250px] items-center justify-center text-sm'>
            No resources yet
          </div>
        ) : (
          <ChartContainer config={chartConfig} className='h-[250px] w-full'>
            <BarChart data={data} layout='vertical' margin={{ left: 16 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type='number' allowDecimals={false} hide />
              <YAxis
                type='category'
                dataKey='label'
                tickLine={false}
                axisLine={false}
                width={110}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey='count' fill='var(--primary)' radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
