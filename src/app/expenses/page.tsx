'use client';

import { ExpenseForm } from '@/components/forms/expense-form';
import { useFinancialData } from '@/contexts/financial-data-context';
import { RecentTransactionsTable } from '@/components/dashboard/recent-transactions-table';

export default function ExpensesPage() {
  const { expenses, isLoading } = useFinancialData();

  return (
    <div className="space-y-8">
      <ExpenseForm />
      <RecentTransactionsTable transactions={expenses} title="All Expenses" maxHeight="500px" isLoading={isLoading}/>
    </div>
  );
}
