
export type Category =
  | "Food & Dining"
  | "Housing"
  | "Transportation"
  | "Utilities"
  | "Healthcare"
  | "Entertainment"
  | "Personal Care"
  | "Shopping"
  | "Education"
  | "Miscellaneous"
  | "Car EMI"
  | "Flat EMI"
  | "SBI Credit Card Bill"
  | "SBI Rupay Credit Card Bill"
  | "Maintenance Charges"
  | "Medicines"
  | "Vegetables"
  | "Grocery"
  | "Petrol"
  | "Broadband Bill"
  | "Electricity Bill"
  | "School Fees"
  | "Other Expense"
  | "Salary" // Added for income categorization if needed
  | "Other Income";

export interface SalaryEntry {
  id: string;
  monthYear: string; // e.g., "2024-07"
  amount: number;
  dateAdded: string; // ISO string
}

export interface Expense {
  id: string;
  date: string; // ISO string
  category: Category;
  amount: number;
  description: string;
}

export interface Budget {
  id:string;
  monthYear: string; // e.g., "2024-07"
  category: Category;
  amount: number;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  budgetStatus: Array<{ category: Category; budgeted: number; spent: number; remaining: number }>;
}
