import { useMutation } from "@tanstack/react-query"

import { addExpense } from "@/services/expense.service"
import { queryClient } from "@/lib/query-client";
import { Expense } from "@/schemas/expense.schema";
import { StatsResponse } from "@/schemas/stats.schema";


export function useAddExpense() {
    return useMutation({
        mutationFn: addExpense,
        onMutate: async (newExpense) => {

            // cancle any ongoing queries(if any)
            await queryClient.cancelQueries({
                queryKey: ["expenses"],
            })

            await queryClient.cancelQueries({
                queryKey: ["stats"],
            })



            // get current cache data to store as backup incase operation fails
            const previousExpenses = queryClient.getQueryData<Expense[]>(["expenses"])
            const previousStats = queryClient.getQueryData<StatsResponse>(["stats"])


            // create a new dummy expense
            const optimisticExpense: Expense = {
                id: `temp-${Date.now()}`,
                ...newExpense,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }



            // add the dummy expense to the expenses cache
            queryClient.setQueryData<Expense[]>(["expenses"], (old = []) => [
                optimisticExpense,
                ...old,
            ])

            // if there is cached stats data, do the following
            if (previousStats) {

                // get the expense date of the newly added expense
                const expenseDate = new Date(newExpense.date_of_expense);
                const now = new Date();

                const isSameMonth = 
                    expenseDate.getFullYear() === now.getFullYear() &&
                    expenseDate.getMonth() === now.getMonth()

                const isSameDay =
                    isSameMonth &&
                    expenseDate.getDate() === now.getDate();  


                // update the stats in the cache by doing necessary calculations
                queryClient.setQueryData<StatsResponse>(["stats"], {
                    total_expenses: previousStats.total_expenses + 1,
                    monthly_spent: previousStats.monthly_spent + (isSameMonth ? newExpense.amount : 0),
                    today_spent: previousStats.today_spent + (isSameDay ? newExpense.amount : 0 )
                })


            }


            // return the context (all these values can be accessed using context in any later steps like onSuccess, onSettle etc)
            // tanstack internally passes this context to all the next steps
            return {
                previousExpenses,
                optimisticExpense,
                previousStats
            }
        },
        onError: (_err, _newExpense, context) => {

            // set the backup data in the cache if operation fails
            queryClient.setQueryData(["expenses"], context?.previousExpenses)
            queryClient.setQueryData(["expenses"], context?.previousStats)
        },
        onSettled: () => {
            // in the end, invalidate queries, so cache can be refetched.
            queryClient.invalidateQueries({ queryKey: ["expenses"] })
            queryClient.invalidateQueries({ queryKey: ["stats"] })
        }

    })
}