
'use client';

import { TrendingUp } from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Legend, Cell } from 'recharts';
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
import { formatCurrency } from '@/lib/utils';

interface SpendingPieChartProps {
  data: Array<{ name: string; value: number; fill: string }>;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export function SpendingPieChart({ 
  data, 
  isLoading = false,
  title = "Spending by Category",
  description = "Current month's expense distribution."
}: SpendingPieChartProps) {

  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill };
    return acc;
  }, {} as any);


  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px]">
           <div className="h-full w-full animate-pulse rounded-full bg-muted"></div>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
        </CardFooter>
      </Card>
    );
  }
  
  const chartTotal = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="flex flex-col shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center">
            <p className="text-muted-foreground">No data for this chart.</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                    hideLabel 
                    formatter={(value, name, props) => {
                      return (
                        <div className="flex w-full items-center justify-between">
                          <div className="flex items-center gap-1.5">
                             <span className="w-2.5 h-2.5 shrink-0 rounded-full" style={{ backgroundColor: props.payload.fill }}/>
                            {name}
                          </div>
                          <span>{Number(value).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                        </div>
                      );
                    }}
                  />}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={60}
                  labelLine={false}
                  label={({ percent, name }) => {
                    if (name === "Remaining" && chartTotal > 0 && data.find(d => d.name === "Remaining")?.value === 0) return ""; // Hide label if Remaining is 0
                    if (chartTotal === 0) return ""; // Hide all labels if total is 0
                    return `${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                 <Legend 
                    content={({ payload }) => (
                        <ul className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2 text-xs">
                        {payload?.map((entry, index) => {
                            const dataEntry = data.find(d => d.name === entry.value);
                            if (!dataEntry || dataEntry.value === 0 && dataEntry.name === "Remaining" && chartTotal > 0) return null; // Don't show legend for 0 value "Remaining" if there's income
                            if (dataEntry.value === 0 && chartTotal === 0) return null; // Don't show legend if value is 0 and chart total is 0

                            return (
                            <li key={`item-${index}`} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                            {entry.value} ({Number(dataEntry.value).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0})})
                            </li>
                        );
                        })}
                        </ul>
                    )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
       <CardFooter className="flex-col gap-2 text-sm mt-auto">
        <div className="flex items-center gap-2 font-medium leading-none">
          {chartTotal > 0 ? `Chart Total: ${formatCurrency(chartTotal)}` : "No data to display"}
        </div>
        <div className="leading-none text-muted-foreground">
          Shows breakdown of income allocation or expenses.
        </div>
      </CardFooter>
    </Card>
  );
}
