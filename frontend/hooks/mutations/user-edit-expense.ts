import { editExpense } from "@/services/expense.service";
import { useMutation } from "@tanstack/react-query";

export function useEditExpense() {
    return useMutation({
        mutationFn: editExpense
    })
}