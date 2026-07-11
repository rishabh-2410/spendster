import { deleteExpense } from "@/services/expense.service";
import { useMutation } from "@tanstack/react-query";

export function useDeleteExpense() {
    return useMutation({
        mutationFn: deleteExpense
    })   
}