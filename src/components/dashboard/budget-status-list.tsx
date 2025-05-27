'use client';

import type { Budget, Expense, Category } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SPENDING_CATEGORIES } from '@/lib/constants';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';

interface BudgetStatusListProps {
  budgets: Budget[];
  expenses: Expense[];
  title?: string;
  maxHeight?: string;
  isLoading?: boolean;
}

export function BudgetStatusList({ budgets, expenses, title = "Budget Status", maxHeight = "300px", isLoading = false }: BudgetStatusListProps) {
  
  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-4 w-1/3 animate-pulse rounded-md bg-muted"></div>
                <div className="h-3 w-full animate-pulse rounded-full bg-muted"></div>
                <div className="h-3 w-1/2 animate-pulse rounded-md bg-muted"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const activeBudgets = budgets.filter(b => SPENDING_CATEGORIES.includes(b.category as Category));

  const budgetStatus = activeBudgets.map(budget => {
    const spent = expenses
      .filter(e => e.category === budget.category)
      .reduce((sum, e) => sum + e.amount, 0);
    const progress = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
    return { ...budget, spent, progress };
  });


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {budgetStatus.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No budgets set for this month.</p>
        ) : (
          <ScrollArea style={{maxHeight}}>
            <div className="space-y-4">
              {budgetStatus.map(status => (
                <div key={status.id} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{status.category}</span>
                    <span className={`text-xs font-semibold ${status.spent > status.amount ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {formatCurrency(status.spent)} / {formatCurrency(status.amount)}
                    </span>
                  </div>
                  <Progress value={status.progress} className={status.progress > 80 ? (status.progress > 100 ? 'bg-destructive/30 [&>div]:bg-destructive' : 'bg-accent/30 [&>div]:bg-accent') : 'bg-primary/30 [&>div]:bg-primary'} />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
