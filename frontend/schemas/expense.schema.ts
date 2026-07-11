import { z } from "zod"

export const expenseSchema = z.object({
    id: z.string(),
    title: z.string(),
    amount: z.number(),
    category: z.string(),
    date_of_expense: z.string(),
    created_at: z.string(),
    updated_at: z.string(),
});


export const expensesResponseSchema = z.array(expenseSchema);

export type Expense = z.infer<typeof expenseSchema>;