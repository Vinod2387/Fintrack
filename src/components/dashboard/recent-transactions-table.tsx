
'use client';

import type { Expense } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';

interface RecentTransactionsTableProps {
  transactions: Expense[];
  title?: string;
  maxHeight?: string;
  isLoading?: boolean;
}

export function RecentTransactionsTable({ transactions, title = "Recent Expenses", maxHeight = "300px", isLoading = false }: RecentTransactionsTableProps) {
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-md bg-muted"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTransactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No transactions yet.</p>
        ) : (
          <ScrollArea style={{ maxHeight }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{new Date(transaction.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</TableCell>
                    <TableCell><Badge variant="secondary">{transaction.category}</Badge></TableCell>
                    <TableCell className="text-right font-medium">
                      -{formatCurrency(transaction.amount).replace(/^₹/, '')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
