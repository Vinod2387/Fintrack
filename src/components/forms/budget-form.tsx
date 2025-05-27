
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinancialData } from '@/contexts/financial-data-context';
import { BudgetSchema } from '@/lib/schemas';
import { SPENDING_CATEGORIES, MONTHS, YEARS, CURRENT_YEAR } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from 'lucide-react';
import type { Category } from '@/types';
import { formatCurrency } from '@/lib/utils';

type BudgetFormValues = z.infer<typeof BudgetSchema>;

export function BudgetForm() {
  const { addBudget, budgets } = useFinancialData();
  const { toast } = useToast();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(BudgetSchema),
    defaultValues: {
      month: MONTHS[new Date().getMonth()],
      year: CURRENT_YEAR,
      category: undefined,
      amount: undefined,
    },
  });
  
  const watchMonth = form.watch("month");
  const watchYear = form.watch("year");
  const watchCategory = form.watch("category");

  React.useEffect(() => {
    if (watchMonth && watchYear && watchCategory) {
      const monthIndex = MONTHS.indexOf(watchMonth) + 1;
      const monthYear = `${watchYear}-${String(monthIndex).padStart(2, '0')}`;
      const existingBudget = budgets.find(b => b.monthYear === monthYear && b.category === watchCategory);
      if (existingBudget) {
        form.setValue("amount", existingBudget.amount);
      } else {
        form.setValue("amount", undefined); 
      }
    }
  }, [watchMonth, watchYear, watchCategory, budgets, form]);


  function onSubmit(values: BudgetFormValues) {
    addBudget(values);
     toast({
      title: "Budget Set/Updated",
      description: `Budget for ${values.category} in ${values.month} ${values.year} set to ${formatCurrency(values.amount)}.`,
    });
    form.reset({ 
      ...values, 
      amount: undefined 
    });
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Set Budget Goal</CardTitle>
        <CardDescription>Define your monthly spending goals for different categories.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Month</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {YEARS.map((year) => (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SPENDING_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 500" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              <PlusCircle className="mr-2 h-4 w-4" /> Set/Update Budget
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
