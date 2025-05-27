
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
import { SalarySchema } from '@/lib/schemas';
import { MONTHS, YEARS, CURRENT_YEAR } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

type SalaryFormValues = z.infer<typeof SalarySchema>;

export function SalaryForm() {
  const { addSalary } = useFinancialData();
  const { toast } = useToast();

  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(SalarySchema),
    defaultValues: {
      month: MONTHS[new Date().getMonth()],
      year: CURRENT_YEAR,
      amount: undefined,
    },
  });

  function onSubmit(values: SalaryFormValues) {
    addSalary(values);
    toast({
      title: "Salary Added",
      description: `Salary of ${formatCurrency(values.amount)} for ${values.month} ${values.year} has been added.`,
    });
    form.reset({
      ...values,
      amount: undefined
    });
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Add Monthly Salary</CardTitle>
        <CardDescription>Enter your salary details for a specific month and year.</CardDescription>
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
                        </Trigger>
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
                        </Trigger>
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5000" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Salary
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
