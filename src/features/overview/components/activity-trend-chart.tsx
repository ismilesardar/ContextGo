'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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
import type { ActivityTrendPoint } from '../utils/use-overview';

const chartConfig = {
  count: {
    label: 'Activity',
    color: 'var(--brand-color)'
  }
} satisfies ChartConfig;

export function ActivityTrendChart({
  data,
  isLoading
}: {
  data: ActivityTrendPoint[] | undefined;
  isLoading: boolean;
}) {
  const hasData = !!data && data.some((point) => point.count > 0);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Activity, last 14 days</CardTitle>
        <CardDescription>
          Resource updates across your visible projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-[250px] w-full' />
        ) : !hasData ? (
          <div className='text-muted-foreground flex h-[250px] items-center justify-center text-sm'>
            No activity in the last 14 days
          </div>
        ) : (
          <ChartContainer config={chartConfig} className='h-[250px] w-full'>
            <AreaChart data={data} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id='fillActivity' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='0%'
                    stopColor='var(--brand-color)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--brand-color)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    }
                  />
                }
              />
              <Area
                dataKey='count'
                type='monotone'
                fill='url(#fillActivity)'
                stroke='var(--brand-color)'
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
