
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Lightbulb, Wand2, AlertTriangle } from 'lucide-react';
import { useFinancialData } from '@/contexts/financial-data-context';
import { generateFinancialTips } from '@/ai/flows/generate-financial-tips';
import { FinancialTipsInputSchema } from '@/lib/schemas';
import { getCurrentMonthYear } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';

type FinancialTipsFormValues = z.infer<typeof FinancialTipsInputSchema>;

export default function FinancialTipsPage() {
  const { getSummaryForMonth, getExpensesForMonth, getBudgetsForMonth, isLoading: dataIsLoading } = useFinancialData();
  const [tips, setTips] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const currentMonthYear = getCurrentMonthYear();
  const summary = getSummaryForMonth(currentMonthYear);
  const expenses = getExpensesForMonth(currentMonthYear);
  const budgets = getBudgetsForMonth(currentMonthYear);

  const defaultSpendingData = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const defaultBudgetGoals = budgets.reduce((acc, budget) => {
    acc[budget.category] = budget.amount;
    return acc;
  }, {} as Record<string, number>);

  const form = useForm<FinancialTipsFormValues>({
    resolver: zodResolver(FinancialTipsInputSchema),
    defaultValues: {
      spendingData: JSON.stringify(defaultSpendingData, null, 2),
      monthlySalary: summary.totalIncome || 0,
      budgetGoals: JSON.stringify(defaultBudgetGoals, null, 2),
    },
  });
  
  // Update default values if financial data changes
  useEffect(() => {
    form.reset({
      spendingData: JSON.stringify(defaultSpendingData, null, 2),
      monthlySalary: summary.totalIncome || 0,
      budgetGoals: JSON.stringify(defaultBudgetGoals, null, 2),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary.totalIncome, expenses, budgets, form.reset]);


  async function onSubmit(values: FinancialTipsFormValues) {
    setIsLoading(true);
    setError(null);
    setTips(null);
    try {
      const result = await generateFinancialTips({
        spendingData: values.spendingData,
        monthlySalary: Number(values.monthlySalary),
        budgetGoals: values.budgetGoals,
      });
      setTips(result.financialTips);
      toast({ title: "Financial Tips Generated!", description: "Here are your personalized financial tips." });
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Failed to generate tips: ${errorMessage}`);
      toast({ variant: "destructive", title: "Error", description: "Could not generate financial tips." });
    } finally {
      setIsLoading(false);
    }
  }

  if (dataIsLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <Wand2 className="mr-2 h-6 w-6 text-primary" /> AI-Powered Financial Tips
          </CardTitle>
          <CardDescription>
            Get personalized financial advice based on your data. Feel free to adjust the data below before generating tips.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="monthlySalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Salary</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="spendingData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Spending Data (JSON format)</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder='e.g., {"Food & Dining": 500, "Transportation": 150}' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budgetGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget Goals (JSON format)</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder='e.g., {"Food & Dining": 400, "Entertainment": 100}' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="mr-2 h-4 w-4" />
                )}
                Generate Tips
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {tips && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
                <Lightbulb className="mr-2 h-5 w-5 text-accent" /> Your Personalized Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground bg-muted/30 p-4 rounded-md">
              {tips}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
