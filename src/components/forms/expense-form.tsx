
'use client';

import React, { useEffect } from 'react'; // Added React and useEffect
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';
import { useFinancialData } from '@/contexts/financial-data-context';
import { ExpenseSchema } from '@/lib/schemas';
import { SPENDING_CATEGORIES } from '@/lib/constants';
import { useToast } from "@/hooks/use-toast";
import type { Category } from '@/types';
import { formatCurrency } from '@/lib/utils';

type ExpenseFormValues = z.infer<typeof ExpenseSchema>;

export function ExpenseForm() {
  const { addExpense } = useFinancialData();
  const { toast } = useToast();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(ExpenseSchema),
    defaultValues: {
      date: undefined, // Initialize date as undefined
      category: undefined,
      amount: '',
      description: '',
    },
  });

  useEffect(() => {
    // Set the date to new Date() only on the client, after initial mount,
    // if it hasn't been set by the user or a previous effect.
    if (form.getValues('date') === undefined) {
      form.setValue('date', new Date(), { shouldDirty: false, shouldValidate: false });
    }
  }, [form]); // form instance is stable, form.setValue is also stable

  function onSubmit(values: ExpenseFormValues) {
    // ExpenseSchema ensures 'date' is a valid Date object here
    addExpense({
        ...values,
        date: values.date!.toISOString(), // Add non-null assertion as it's validated
        amount: parseFloat(String(values.amount))
    });
    toast({
      title: "Expense Added",
      description: `${values.category} expense of ${formatCurrency(parseFloat(String(values.amount)))} added.`,
    });
    form.reset({
      date: new Date(), // This is fine here as onSubmit is a client-side event
      category: undefined,
      amount: '',
      description: '',
    });
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Add Expense</CardTitle>
        <CardDescription>Track your spending by adding new expense entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value instanceof Date && !isNaN(field.value.valueOf()) ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 45.50"
                      {...field}
                      onChange={e => {
                          const strVal = e.target.value;
                          if (strVal === "") {
                            field.onChange(''); 
                          } else {
                            field.onChange(strVal); 
                          }
                        }}
                      value={field.value === undefined || field.value === null || Number.isNaN(field.value) ? '' : String(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Coffee with friends" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
