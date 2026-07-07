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
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import type { McpRequestTrendPoint } from '../utils/use-overview';

const chartConfig = {
  received: {
    label: 'Received',
    color: 'var(--chart-1)'
  },
  sent: {
    label: 'Sent',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig;

export function McpRequestTrendChart({
  data,
  isLoading
}: {
  data: McpRequestTrendPoint[] | undefined;
  isLoading: boolean;
}) {
  const hasData =
    !!data && data.some((point) => point.received > 0 || point.sent > 0);

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>MCP Requests, last 14 days</CardTitle>
        <CardDescription>
          Requests received and responded to across your visible projects' MCP
          servers
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-[250px] w-full' />
        ) : !hasData ? (
          <div className='text-muted-foreground flex h-[250px] items-center justify-center text-sm'>
            No MCP requests in the last 14 days
          </div>
        ) : (
          <ChartContainer config={chartConfig} className='h-[250px] w-full'>
            <AreaChart data={data} margin={{ left: 12, right: 12 }}>
              <defs>
                <linearGradient id='fillReceived' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='0%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--chart-1)'
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id='fillSent' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='0%'
                    stopColor='var(--chart-2)'
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='100%'
                    stopColor='var(--chart-2)'
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
                dataKey='received'
                type='monotone'
                fill='url(#fillReceived)'
                stroke='var(--chart-1)'
              />
              <Area
                dataKey='sent'
                type='monotone'
                fill='url(#fillSent)'
                stroke='var(--chart-2)'
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
