import { deleteExpense } from "@/services/expense.service";
import { Expense } from "@/schemas/expense.schema";
import { queryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import { StatsResponse } from "@/schemas/stats.schema";

export function useDeleteExpense() {
    return useMutation({
        mutationFn: deleteExpense,
        onMutate: async (expenseID) => {
            await queryClient.cancelQueries({
                queryKey: ["expenses"],
            })

            await queryClient.cancelQueries({
                queryKey: ["stats"],
            })

            const previousExpenses = queryClient.getQueryData<Expense[]>(["expenses"])
            const previousStats = queryClient.getQueryData<StatsResponse>(["stats"])

            const deletedExpense = previousExpenses?.find((expense) => expense.id === expenseID)



            queryClient.setQueryData<Expense[]>(["expenses"], (old = []) => old.filter((item) => item.id !== expenseID))

            if (previousStats && deletedExpense) {
                const deletedExpenseDate = new Date(deletedExpense.date_of_expense)
                const now = new Date()

                const isSameMonth =
                    deletedExpenseDate.getFullYear() === now.getFullYear() &&
                    deletedExpenseDate.getMonth() === now.getMonth()

                const isSameDay =
                    isSameMonth &&
                    deletedExpenseDate.getDate() === now.getDate()

                queryClient.setQueryData<StatsResponse>(["stats"], {
                    total_expenses: previousStats.total_expenses - 1,
                    monthly_spent: previousStats.monthly_spent - (isSameMonth ? deletedExpense.amount : 0),
                    today_spent: previousStats.today_spent - (isSameDay ? deletedExpense.amount : 0)
                })
            }
        }
    })
}
