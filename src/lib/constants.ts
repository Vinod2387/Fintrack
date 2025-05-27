import type { Category } from '@/types';

export const SPENDING_CATEGORIES: Category[] = [
  "Food & Dining",
  "Housing",
  "Transportation",
  // "Utilities", // Removed
  // "Healthcare", // Removed
  // "Entertainment", // Removed
  // "Personal Care", // Removed
  // "Shopping", // Removed
  "Education",
  "Miscellaneous",
  "Car EMI",
  "Flat EMI",
  "SBI Credit Card Bill",
  "SBI Rupay Credit Card Bill",
  "Maintenance Charges",
  "Medicines",
  "Vegetables",
  "Grocery",
  "Petrol",
  "Broadband Bill",
  "Electricity Bill",
  "School Fees",
  "Other Expense",
  "Mobile Recharge", // Added
  "Cylinder", // Added
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
