import { z } from 'zod';
import { SPENDING_CATEGORIES, MONTHS, YEARS } from './constants';
import type { Category } from '@/types';

export const SalarySchema = z.object({
  month: z.string().refine(val => MONTHS.includes(val), { message: "Invalid month" }),
  year: z.number().refine(val => YEARS.includes(val), { message: "Invalid year" }),
  amount: z.coerce.number().positive({ message: 'Salary amount must be positive' }),
});

// Dynamically create the enum from the SPENDING_CATEGORIES array
const spendingCategoriesTuple = SPENDING_CATEGORIES as [Category, ...Category[]];

export const ExpenseSchema = z.object({
  date: z.date({ required_error: 'Date is required' }),
  category: z.enum(spendingCategoriesTuple, { required_error: 'Category is required' }),
  amount: z.coerce.number().positive({ message: 'Amount must be positive' }),
  description: z.string().max(100, { message: 'Description cannot exceed 100 characters' }).optional(),
});

export const BudgetSchema = z.object({
  month: z.string().refine(val => MONTHS.includes(val), { message: "Invalid month" }),
  year: z.number().refine(val => YEARS.includes(val), { message: "Invalid year" }),
  category: z.enum(spendingCategoriesTuple, { required_error: 'Category is required' }),
  amount: z.coerce.number().positive({ message: 'Budget amount must be positive' }),
});

export const FinancialTipsInputSchema = z.object({
  spendingData: z.string().min(1, "Spending data is required."),
  monthlySalary: z.coerce.number().nonnegative("Monthly salary cannot be negative."),
  budgetGoals: z.string().min(1, "Budget goals are required."),
});
