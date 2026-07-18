import { queryClient } from "@/lib/query-client";
import { Expense } from "@/schemas/expense.schema";
import { StatsResponse } from "@/schemas/stats.schema";
import { editExpense } from "@/services/expense.service";
import { useMutation } from "@tanstack/react-query";

export function useEditExpense() {
    return useMutation({
        mutationFn: editExpense,
        onMutate: async (editPayload) => {
            await queryClient.cancelQueries({
                queryKey: ["expenses"],
            })

            await queryClient.cancelQueries({
                queryKey: ["stats"],
            })

            const previousExpenses = queryClient.getQueryData<Expense[]>(["expenses"])
            const previousStats = queryClient.getQueryData<StatsResponse>(["stats"])

            const editedExpense = previousExpenses?.find((expense) => expense.id === editPayload.expenseID)

            if (!editedExpense) {
                return { previousExpenses, previousStats, editedExpense: null };
            }

            const optimisticExpense: Expense = {
                ...editedExpense,
                ...editPayload.editRequest,
                updated_at: new Date().toISOString()
            }

            queryClient.setQueryData<Expense[]>(["expenses"], (old = []) => old.map((expense) => expense.id === editPayload.expenseID ? optimisticExpense : expense))

            if (
                previousStats &&
                editPayload.editRequest.amount !== undefined
            ) {
                const expenseDate = new Date(editedExpense.date_of_expense);
                const now = new Date();

                const isSameMonth =
                    expenseDate.getFullYear() === now.getFullYear() &&
                    expenseDate.getMonth() === now.getMonth();

                const isSameDay = isSameMonth && expenseDate.getDate() === now.getDate();

                const amountDiff = editPayload.editRequest.amount - editedExpense.amount;

                queryClient.setQueryData<StatsResponse>(["stats"], {
                    total_expenses: previousStats.total_expenses,
                    monthly_spent:
                        previousStats.monthly_spent + (isSameMonth ? amountDiff : 0),
                    today_spent:
                        previousStats.today_spent + (isSameDay ? amountDiff : 0),
                });
            }
            return { previousExpenses, previousStats, editedExpense };
        },
        onError: (_error, _variables, context) => {
            queryClient.setQueryData(["expenses"], context?.previousExpenses);
            queryClient.setQueryData(["stats"], context?.previousStats);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses"] });
            queryClient.invalidateQueries({ queryKey: ["stats"] });
        },
    })
}