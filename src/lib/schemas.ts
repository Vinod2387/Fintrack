import { z } from 'zod';
import { SPENDING_CATEGORIES, MONTHS, YEARS } from './constants';

export const SalarySchema = z.object({
  month: z.string().refine(val => MONTHS.includes(val), { message: "Invalid month" }),
  year: z.number().refine(val => YEARS.includes(val), { message: "Invalid year" }),
  amount: z.coerce.number().positive({ message: 'Salary amount must be positive' }),
});

export const ExpenseSchema = z.object({
  date: z.date({ required_error: 'Date is required' }),
  category: z.enum(SPENDING_CATEGORIES as [string, ...string[]], { required_error: 'Category is required' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
  description: z.string().min(1, { message: 'Description is required' }).max(100, { message: 'Description too long' }),
});

export const BudgetSchema = z.object({
  month: z.string().refine(val => MONTHS.includes(val), { message: "Invalid month" }),
  year: z.number().refine(val => YEARS.includes(val), { message: "Invalid year" }),
  category: z.enum(SPENDING_CATEGORIES as [string, ...string[]], { required_error: 'Category is required' }),
  amount: z.coerce.number().positive({ message: 'Budget amount must be positive' }),
});

export const FinancialTipsInputSchema = z.object({
  spendingData: z.string().min(1, "Spending data is required."),
  monthlySalary: z.coerce.number().nonnegative("Monthly salary cannot be negative."),
  budgetGoals: z.string().min(1, "Budget goals are required."),
});
