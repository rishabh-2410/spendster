import { fetchExpenses } from "@/services/expense.service";
import { useQuery } from "@tanstack/react-query";

export function useExpenses() {
    return useQuery({
        queryKey: ["expenses"],
        queryFn: fetchExpenses
    })
}