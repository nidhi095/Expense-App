import { z } from 'zod';

// ✅ Expense Schema
export const expenseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  merchant: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  otherCategory: z.string().optional(),
  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount')
    .min(1, 'Amount is required'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
    .optional(),
  reimburse: z.boolean().optional(),
});

// ✅ Trip Schema
export const tripSchema = z.object({
  tripName: z.string().min(1, 'Trip name is required'),
  purpose: z.string().optional(),
  travelType: z.enum(['Domestic', 'International']),
});

// ✅ Report Schema
export const reportSchema = z.object({
  reportName: z.string().min(1, 'Report name is required'),
  purpose: z.string().optional(),
  fromDate: z.date(),
  toDate: z.date(),
});

// ✅ Export types (so TS knows what form data looks like)
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type TripFormData = z.infer<typeof tripSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
