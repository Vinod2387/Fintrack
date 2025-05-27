
'use client';

import Image from 'next/image';
import { DollarSign, TrendingDown, Coins, AlertTriangle } from 'lucide-react';
import { OverviewCard } from '@/components/dashboard/overview-card';
import { RecentTransactionsTable } from '@/components/dashboard/recent-transactions-table';
import { BudgetStatusList } from '@/components/dashboard/budget-status-list';
import { useFinancialData } from '@/contexts/financial-data-context';
import { getCurrentMonthYear } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SpendingPieChart } from '@/components/charts/spending-pie-chart';
import { MonthlySummaryChart } from '@/components/charts/monthly-summary-chart';


export default function DashboardPage() {
  const { getSummaryForMonth, getExpensesForMonth, getBudgetsForMonth, isLoading, salaries } = useFinancialData();
  const currentMonthYear = getCurrentMonthYear();
  
  const summary = getSummaryForMonth(currentMonthYear);
  const expenses = getExpensesForMonth(currentMonthYear);
  const budgets = getBudgetsForMonth(currentMonthYear);

  const pieChartData: Array<{ name: string; value: number; fill: string }> = [];
  let cumulativeExpenses = 0;
  const MAX_CHART_COLORS = 10; 

  const aggregatedExpenses: Record<string, number> = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  let colorIndex = 0;
  for (const category in aggregatedExpenses) {
    const amount = aggregatedExpenses[category];
    if (amount > 0) {
      pieChartData.push({
        name: category,
        value: amount,
        fill: `hsl(var(--chart-${(colorIndex % MAX_CHART_COLORS) + 1}))`,
      });
      cumulativeExpenses += amount;
      colorIndex++;
    }
  }

  const remainingAmountFromIncome = summary.totalIncome - cumulativeExpenses;

  if (summary.totalIncome > 0) { // Only consider "Remaining" if there's income
    pieChartData.push({
      name: 'Remaining',
      value: Math.max(0, remainingAmountFromIncome), // Value can't be negative for pie slice
      fill: 'hsl(var(--chart-green))', 
    });
  }
  
  const monthlyExpensesChartData = [];
  const today = new Date();
  for (let i = 3; i >= 0; i--) { // Show current month and past 3 months
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthSummary = getSummaryForMonth(monthYear);
    monthlyExpensesChartData.push({
      month: date.toLocaleString('default', { month: 'short' }),
      expenses: monthSummary.totalExpenses,
    });
  }


  const noData = !isLoading && summary.totalIncome === 0 && expenses.length === 0 && budgets.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="mb-6 shadow-lg rounded-lg overflow-hidden">
        <Image
          src="https://placehold.co/1200x300.png"
          alt="Financial Dashboard Banner"
          width={1200}
          height={300}
          className="w-full object-cover max-h-[200px] md:max-h-[300px]"
          data-ai-hint="finance abstract"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          title="Total Income (Current Month)"
          value={summary.totalIncome}
          icon={DollarSign}
          isLoading={isLoading}
        />
        <OverviewCard
          title="Total Expenses (Current Month)"
          value={summary.totalExpenses}
          icon={TrendingDown}
          isLoading={isLoading}
        />
        <OverviewCard
          title="Net Balance (Current Month)"
          value={summary.remainingBalance} // This is totalIncome - totalExpenses
          icon={Coins}
          iconClassName={summary.remainingBalance >=0 ? "" : "text-destructive"} 
          isLoading={isLoading}
        />
      </div>

      {noData && (
        <Alert variant="default" className="bg-accent/20 border-accent text-accent-foreground">
          <AlertTriangle className="h-4 w-4 !text-accent" />
          <AlertTitle>Welcome to FinTrack!</AlertTitle>
          <AlertDescription>
            Start by adding your monthly salary, then track your expenses and set budgets to get insights into your finances.
            <div className="mt-4 flex gap-2">
              <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/30">
                <Link href="/salary">Add Salary</Link>
              </Button>
              <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent/30">
                <Link href="/expenses">Add Expense</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <SpendingPieChart 
            data={pieChartData} 
            isLoading={isLoading}
            title="Income Allocation (Current Month)"
            description={summary.totalIncome > 0 ? "Breakdown of your income: expenses and remaining." : "Breakdown of your expenses."}
        />
        <MonthlySummaryChart data={monthlyExpensesChartData} isLoading={isLoading} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentTransactionsTable transactions={expenses} isLoading={isLoading} />
        <BudgetStatusList budgets={budgets} expenses={expenses} isLoading={isLoading} />
      </div>
    </div>
  );
}
