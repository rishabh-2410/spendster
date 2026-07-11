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





export const editExpenseScheme = z.object({
  amount:  z.number().optional(),
  category: z.string().optional(),
})
export type EditExpenseRequest = z.infer<typeof editExpenseScheme>

export type EditExpenseMutationRequest = {
  expenseID: string;
  editRequest: EditExpenseRequest;
};

export const addExpenseSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required"),

  amount: z
    .number({
      error: "Amount is required",
    })
    .positive("Amount must be greater than 0"),

  category: z
    .string()
    .min(1, "Category is required"),

  date_of_expense: z.date(),
});

export type AddExpenseRequest = z.infer<
  typeof addExpenseSchema
>;


export const expensesResponseSchema = z.array(expenseSchema);

export type Expense = z.infer<typeof expenseSchema>;

export type AddExpenseRequestObject = {
  title: string,
  amount: number,
  category: string,
  date_of_expense: string,
}



