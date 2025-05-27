
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface MonthlySummaryChartProps {
  data: Array<{ month: string; expenses: number }>; // Changed: no more income
  isLoading?: boolean;
}

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))", // Using accent color for expenses
  },
} satisfies import("@/components/ui/chart").ChartConfig;


export function MonthlySummaryChart({ data, isLoading = false }: MonthlySummaryChartProps) {
  if (isLoading) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
          <CardDescription>Expenses over the last few months.</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px]">
           <div className="h-full w-full animate-pulse rounded-md bg-muted"></div>
        </CardContent>
         <CardFooter className="flex-col gap-2 text-sm">
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
        </CardFooter>
      </Card>
    );
  }

  const yAxisFormatter = (value: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR', 
      notation: 'compact', 
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>Expenses over the last few months.</CardDescription>
      </CardHeader>
      <CardContent>
         {data.length === 0 || data.every(d => d.expenses === 0) ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-muted-foreground">Not enough data for monthly expenses.</p>
          </div>
        ) : (
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -5, bottom: 5 }} barCategoryGap="30%"> {/* Increased barCategoryGap */}
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} width={80} tickFormatter={yAxisFormatter} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
                content={<ChartTooltipContent 
                  indicator="dashed" 
                  formatter={(value, name) => {
                    const config = chartConfig[name as keyof typeof chartConfig];
                    return (
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 shrink-0 rounded-full" style={{ backgroundColor: config.color }}/>
                          {config.label}
                        </div>
                        <span>{Number(value).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                      </div>
                    );
                  }}
                />}
              />
              <Legend />
              <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[6, 6, 0, 0]} barSize={40} /> {/* Adjusted barSize and radius */}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-auto">
        <div className="leading-none text-muted-foreground">
          Track your expenses month over month.
        </div>
      </CardFooter>
    </Card>
  );
}
