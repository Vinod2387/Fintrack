'use client';

import { SalaryForm } from '@/components/forms/salary-form';
import { useFinancialData } from '@/contexts/financial-data-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/utils';

export default function SalaryPage() {
  const { salaries, isLoading } = useFinancialData();

  const sortedSalaries = [...salaries].sort((a, b) => {
    const dateA = new Date(a.dateAdded);
    const dateB = new Date(b.dateAdded);
    return dateB.getTime() - dateA.getTime();
  });
  
  const getMonthName = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' })} ${year}`;
  }


  return (
    <div className="space-y-8">
      <SalaryForm />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
          <CardDescription>View your recorded salary entries.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 animate-pulse rounded-md bg-muted"></div>
                ))}
              </div>
          ) : sortedSalaries.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No salary entries yet.</p>
          ) : (
            <ScrollArea className="h-[300px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month & Year</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date Added</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedSalaries.map((salary) => (
                    <TableRow key={salary.id}>
                      <TableCell>{getMonthName(salary.monthYear)}</TableCell>
                      <TableCell>{formatCurrency(salary.amount)}</TableCell>
                      <TableCell>{new Date(salary.dateAdded).toLocaleDateString()}</TableCell>
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
