import { useMutation} from "@tanstack/react-query"

import {addExpense} from "@/services/expense.service"


export function useAddExpense() {
    return useMutation({
        mutationFn: addExpense
    })
}