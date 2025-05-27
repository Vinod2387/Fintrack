'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SalaryEntry, Expense, Budget } from '@/types';
import { getCurrentMonthYear } from '@/lib/constants';

interface FinancialDataContextType {
  salaries: SalaryEntry[];
  expenses: Expense[];
  budgets: Budget[];
  addSalary: (salary: Omit<SalaryEntry, 'id' | 'dateAdded' | 'monthYear'> & { month: string; year: number }) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'monthYear'> & { month: string; year: number }) => void;
  getSummaryForMonth: (monthYear: string) => { totalIncome: number; totalExpenses: number; remainingBalance: number };
  getExpensesForMonth: (monthYear: string) => Expense[];
  getBudgetsForMonth: (monthYear: string) => Budget[];
  isLoading: boolean;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

const safelyParseJSON = <T,>(jsonString: string | null, defaultValue: T): T => {
  if (!jsonString) return defaultValue;
  try {
    const parsed = JSON.parse(jsonString);
    // Revive dates
    if (Array.isArray(parsed)) {
      return parsed.map(item => {
        if (item && typeof item === 'object') {
          if (item.dateAdded) item.dateAdded = new Date(item.dateAdded);
          if (item.date) item.date = new Date(item.date);
        }
        return item;
      }) as T;
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse JSON from localStorage", error);
    return defaultValue;
  }
};

export const FinancialDataProvider = ({ children }: { children: ReactNode }) => {
  const [salaries, setSalaries] = useState<SalaryEntry[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSalaries(safelyParseJSON<SalaryEntry[]>(localStorage.getItem('fintechSalaries'), []));
    setExpenses(safelyParseJSON<Expense[]>(localStorage.getItem('fintechExpenses'), []));
    setBudgets(safelyParseJSON<Budget[]>(localStorage.getItem('fintechBudgets'), []));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('fintechSalaries', JSON.stringify(salaries));
    }
  }, [salaries, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('fintechExpenses', JSON.stringify(expenses));
    }
  }, [expenses, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('fintechBudgets', JSON.stringify(budgets));
    }
  }, [budgets, isLoading]);

  const addSalary = useCallback((salaryInput: Omit<SalaryEntry, 'id' | 'dateAdded' | 'monthYear'> & { month: string; year: number }) => {
    const monthIndex = new Date(Date.parse(salaryInput.month +" 1, 2000")).getMonth() + 1;
    const monthYear = `${salaryInput.year}-${String(monthIndex).padStart(2, '0')}`;
    
    const newSalary: SalaryEntry = {
      ...salaryInput,
      id: crypto.randomUUID(),
      monthYear,
      dateAdded: new Date().toISOString(),
    };
    setSalaries(prev => [...prev, newSalary]);
  }, []);

  const addExpense = useCallback((expenseInput: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseInput,
      id: crypto.randomUUID(),
      date: new Date(expenseInput.date).toISOString(),
    };
    setExpenses(prev => [...prev, newExpense]);
  }, []);
  
  const addBudget = useCallback((budgetInput: Omit<Budget, 'id' | 'monthYear'> & { month: string; year: number }) => {
    const monthIndex = new Date(Date.parse(budgetInput.month +" 1, 2000")).getMonth() + 1;
    const monthYear = `${budgetInput.year}-${String(monthIndex).padStart(2, '0')}`;
    
    const newBudget: Budget = {
      ...budgetInput,
      id: crypto.randomUUID(),
      monthYear,
    };
    // Remove existing budget for the same category and month/year before adding new one
    setBudgets(prev => [...prev.filter(b => !(b.category === newBudget.category && b.monthYear === newBudget.monthYear)), newBudget]);
  }, []);

  const getExpensesForMonth = useCallback((monthYear: string): Expense[] => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}` === monthYear;
    });
  }, [expenses]);
  
  const getBudgetsForMonth = useCallback((monthYear: string): Budget[] => {
    return budgets.filter(budget => budget.monthYear === monthYear);
  }, [budgets]);

  const getSummaryForMonth = useCallback((monthYear: string) => {
    const monthlySalaries = salaries.filter(s => s.monthYear === monthYear);
    const totalIncome = monthlySalaries.reduce((sum, s) => sum + s.amount, 0);

    const monthlyExpenses = getExpensesForMonth(monthYear);
    const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const remainingBalance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, remainingBalance };
  }, [salaries, getExpensesForMonth]);


  return (
    <FinancialDataContext.Provider value={{ salaries, expenses, budgets, addSalary, addExpense, addBudget, getSummaryForMonth, getExpensesForMonth, getBudgetsForMonth, isLoading }}>
      {children}
    </FinancialDataContext.Provider>
  );
};

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
};
