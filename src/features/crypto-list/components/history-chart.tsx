import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AssetHistory } from '../types';
import { getShortDate } from '@/utils/dates';
import { LoadingSpinner } from './loading-spinner';

const chartConfig = {
  priceUsd: {
    label: 'Price(USD): ',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function HistoryChart({
  chartData,
  isLoading,
}: {
  chartData?: Array<AssetHistory>;
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
        <CardDescription>
          Showing history of the price in the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="md:w-3/4 lg:w-3/5 mx-auto">
        {isLoading ? (
          <LoadingSpinner />
        ) : chartData ? (
          <ChartContainer config={chartConfig}>
            <AreaChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis
                hide
                axisLine={false}
                tickLine={false}
                dataKey="priceUsd"
                domain={['auto', 'auto']}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={value => getShortDate(value)}
                    hideIndicator
                  />
                }
              />
              <Area
                dataKey="priceUsd"
                type="linear"
                fill="var(--color-priceUsd)"
                fillOpacity={0.4}
                stroke="var(--color-priceUsd)"
              />
            </AreaChart>
          </ChartContainer>
        ) : null}
      </CardContent>
    </Card>
  );
}
