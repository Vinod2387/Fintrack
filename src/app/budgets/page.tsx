'use client';

import { BudgetForm } from '@/components/forms/budget-form';
import { useFinancialData } from '@/contexts/financial-data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCurrentMonthYear, MONTHS } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function BudgetsPage() {
  const { budgets, isLoading, getExpensesForMonth } = useFinancialData();
  const [selectedMonthYear, setSelectedMonthYear] = useState(getCurrentMonthYear());

  const currentYear = new Date().getFullYear();
  const monthYearOptions = Array.from({ length: 12 * 3 }, (_, i) => { // 3 years of options: last year, current year, next year
    const date = new Date(currentYear -1, i % 12, 1);
    if (i >= 12 && i < 24) date.setFullYear(currentYear);
    if (i >= 24) date.setFullYear(currentYear + 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }).filter((value, index, self) => self.indexOf(value) === index) // unique
    .sort((a, b) => b.localeCompare(a));


  const getMonthName = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' })} ${year}`;
  }

  const filteredBudgets = budgets.filter(b => b.monthYear === selectedMonthYear);
  const expensesForSelectedMonth = getExpensesForMonth(selectedMonthYear);

  return (
    <div className="space-y-8">
      <BudgetForm />

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Your budget goals for the selected month.</CardDescription>
          </div>
          <Select value={selectedMonthYear} onValueChange={setSelectedMonthYear}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthYearOptions.map(my => (
                <SelectItem key={my} value={my}>{getMonthName(my)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-md bg-muted"></div>
              ))}
            </div>
          ) : filteredBudgets.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No budgets set for {getMonthName(selectedMonthYear)}.</p>
          ) : (
            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Budgeted</TableHead>
                    <TableHead>Spent</TableHead>
                    <TableHead>Remaining</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBudgets.map((budget) => {
                    const spent = expensesForSelectedMonth
                      .filter(e => e.category === budget.category)
                      .reduce((sum, e) => sum + e.amount, 0);
                    const remaining = budget.amount - spent;
                    return (
                      <TableRow key={budget.id}>
                        <TableCell>{budget.category}</TableCell>
                        <TableCell>${budget.amount.toFixed(2)}</TableCell>
                        <TableCell>${spent.toFixed(2)}</TableCell>
                        <TableCell className={remaining < 0 ? 'text-destructive' : 'text-green-600'}>
                          ${remaining.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {spent > budget.amount ? (
                            <Badge variant="destructive">Over Budget</Badge>
                          ) : spent / budget.amount > 0.8 ? (
                            <Badge variant="outline" className="border-accent text-accent">Near Limit</Badge>
                          ) : (
                            <Badge variant="secondary" className="border-green-500 text-green-700">On Track</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
