'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { DailyTokenUsage } from '@/hooks/use-token-usage';

interface Props {
  entries: DailyTokenUsage[];
  isLoading?: boolean;
}

const systemChartConfig = {
  systemTokens: {
    label: 'System Tokens',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

const imageChartConfig = {
  imageTokens: {
    label: 'Image Tokens',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function TokenBarChart({
  data,
  title,
  dataKey,
  config,
  isLoading
}: {
  data: DailyTokenUsage[];
  title: string;
  dataKey: 'systemTokens' | 'imageTokens';
  config: ChartConfig;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <Card className='@container/card'>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        </CardHeader>
        <CardContent className='flex h-62.5 items-center justify-center'>
          <div className='text-muted-foreground text-sm'>Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className='@container/card'>
        <CardHeader>
          <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        </CardHeader>
        <CardContent className='flex h-62.5 items-center justify-center'>
          <div className='text-muted-foreground text-sm'>No data yet</div>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((acc, curr) => acc + curr[dataKey], 0);

  return (
    <Card className='@container/card'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <span className='text-muted-foreground text-xs'>
          Total: {total.toLocaleString()}
        </span>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={config} className='aspect-auto h-62.5 w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => formatDate(value)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator='dot'
                    labelFormatter={(label: string) => formatDate(label)}
                  />
                }
              />
              <Bar
                dataKey={dataKey}
                fill={`var(--color-${dataKey})`}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export function TokenUsageCharts({ entries, isLoading }: Props) {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:gap-6'>
      <TokenBarChart
        data={entries}
        title='System Token Usage per Day'
        dataKey='systemTokens'
        config={systemChartConfig}
        isLoading={isLoading}
      />
      <TokenBarChart
        data={entries}
        title='Image Token Usage per Day'
        dataKey='imageTokens'
        config={imageChartConfig}
        isLoading={isLoading}
      />
    </div>
  );
}
