'use client';

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
  const { getSummaryForMonth, getExpensesForMonth, getBudgetsForMonth, isLoading } = useFinancialData();
  const currentMonthYear = getCurrentMonthYear();
  
  const summary = getSummaryForMonth(currentMonthYear);
  const expenses = getExpensesForMonth(currentMonthYear);
  const budgets = getBudgetsForMonth(currentMonthYear);

  const spendingDataForChart = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount, fill: `var(--chart-${(acc.length % 5) + 1})` });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; fill: string }>);

  const monthlyChartData = [ // Example data, should be dynamic based on past months
    { month: "Jan", income: 4000, expenses: 2200 },
    { month: "Feb", income: 4100, expenses: 2500 },
    { month: "Mar", income: 4050, expenses: 2300 },
    { month: "Apr", income: summary.totalIncome, expenses: summary.totalExpenses }, // Current month
  ];


  const noData = !isLoading && summary.totalIncome === 0 && expenses.length === 0 && budgets.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OverviewCard
          title="Total Income (Current Month)"
          value={summary.totalIncome}
          icon={DollarSign}
          iconClassName="text-green-500"
          isLoading={isLoading}
        />
        <OverviewCard
          title="Total Expenses (Current Month)"
          value={summary.totalExpenses}
          icon={TrendingDown}
          iconClassName="text-red-500"
          isLoading={isLoading}
        />
        <OverviewCard
          title="Remaining Balance (Current Month)"
          value={summary.remainingBalance}
          icon={Coins}
          iconClassName={summary.remainingBalance >=0 ? "text-blue-500" : "text-destructive"}
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
        <SpendingPieChart data={spendingDataForChart} isLoading={isLoading} />
        <MonthlySummaryChart data={monthlyChartData} isLoading={isLoading} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentTransactionsTable transactions={expenses} isLoading={isLoading} />
        <BudgetStatusList budgets={budgets} expenses={expenses} isLoading={isLoading} />
      </div>
    </div>
  );
}
