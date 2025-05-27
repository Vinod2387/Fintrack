// src/ai/flows/generate-financial-tips.ts
'use server';

/**
 * @fileOverview Generates personalized financial tips based on user spending habits.
 *
 * - generateFinancialTips - A function that generates financial tips.
 * - GenerateFinancialTipsInput - The input type for the generateFinancialTips function.
 * - GenerateFinancialTipsOutput - The return type for the generateFinancialTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFinancialTipsInputSchema = z.object({
  spendingData: z
    .string()
    .describe(
      'A string containing the user spending data, including categories and amounts.'
    ),
  monthlySalary: z.number().describe('The user\u2019s monthly salary.'),
  budgetGoals: z
    .string()
    .describe(
      'A string containing the user\u2019s budget goals for different spending categories.'
    ),
});

export type GenerateFinancialTipsInput = z.infer<
  typeof GenerateFinancialTipsInputSchema
>;

const GenerateFinancialTipsOutputSchema = z.object({
  financialTips: z
    .string()
    .describe('Personalized financial tips based on spending habits.'),
});

export type GenerateFinancialTipsOutput = z.infer<
  typeof GenerateFinancialTipsOutputSchema
>;

export async function generateFinancialTips(
  input: GenerateFinancialTipsInput
): Promise<GenerateFinancialTipsOutput> {
  return generateFinancialTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFinancialTipsPrompt',
  input: {schema: GenerateFinancialTipsInputSchema},
  output: {schema: GenerateFinancialTipsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending habits, monthly salary, and budget goals to provide personalized financial tips.

Spending Data: {{{spendingData}}}
Monthly Salary: {{{monthlySalary}}}
Budget Goals: {{{budgetGoals}}}

Based on this information, provide actionable financial tips to help the user improve their money management and achieve their financial goals.`,
});

const generateFinancialTipsFlow = ai.defineFlow(
  {
    name: 'generateFinancialTipsFlow',
    inputSchema: GenerateFinancialTipsInputSchema,
    outputSchema: GenerateFinancialTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
