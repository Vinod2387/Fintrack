'use client';

import { SpendingPieChart } from '@/components/charts/spending-pie-chart';
import { MonthlySummaryChart } from '@/components/charts/monthly-summary-chart';
import { useFinancialData } from '@/contexts/financial-data-context';
import { getCurrentMonthYear, MONTHS, SPENDING_CATEGORIES } from '@/lib/constants'; // Added SPENDING_CATEGORIES
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Expense } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function ReportsPage() {
  const { getExpensesForMonth, getSummaryForMonth, isLoading } = useFinancialData();
  const currentMonthYear = getCurrentMonthYear();
  
  const expenses = getExpensesForMonth(currentMonthYear);
  const summary = getSummaryForMonth(currentMonthYear);

  const spendingDataForPieChart = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category);
    if (existing) {
      existing.value += expense.amount;
    } else {
      acc.push({ name: expense.category, value: expense.amount, fill: `hsl(var(--chart-${(acc.length % 10) + 1}))` });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; fill: string }>);

  const monthlySummaryData: Array<{ month: string; income: number; expenses: number }> = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthSummary = getSummaryForMonth(monthYear);
    monthlySummaryData.push({
      month: MONTHS[date.getMonth()].substring(0,3),
      income: monthSummary.totalIncome,
      expenses: monthSummary.totalExpenses,
    });
  }
  
  const categorySummary = SPENDING_CATEGORIES.map(category => {
    const categoryExpenses = expenses.filter(e => e.category === category);
    const totalSpent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    return { category, totalSpent, transactionCount: categoryExpenses.length };
  }).filter(c => c.totalSpent > 0)
    .sort((a,b) => b.totalSpent - a.totalSpent);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Financial Reports</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingPieChart data={spendingDataForPieChart} isLoading={isLoading} />
        <MonthlySummaryChart data={monthlySummaryData} isLoading={isLoading}/>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Category Spending Summary (Current Month)</CardTitle>
          <CardDescription>Detailed breakdown of spending per category.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-40 animate-pulse rounded-md bg-muted"></div>
          ) : categorySummary.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No expenses recorded this month.</p>
          ) : (
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categorySummary.map(item => (
                    <TableRow key={item.category}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.totalSpent)}</TableCell>
                      <TableCell className="text-right">{item.transactionCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
