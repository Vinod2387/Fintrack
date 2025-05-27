import type { Category } from '@/types';

export const SPENDING_CATEGORIES: Category[] = [
  "Food & Dining",
  "Housing",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Entertainment",
  "Personal Care",
  "Shopping",
  "Education",
  "Miscellaneous",
];

export const INCOME_CATEGORIES: Category[] = [
  "Salary",
  "Other Income",
];

export const ALL_CATEGORIES: Category[] = [...SPENDING_CATEGORIES, ...INCOME_CATEGORIES];

export const MONTHS: string[] = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS: number[] = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - 5 + i);

export function getCurrentMonthYear(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
