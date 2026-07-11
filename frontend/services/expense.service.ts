import { expensesResponseSchema } from "@/schemas/expense.schema";
import { useAuthStore } from "@/store/auth.store";

const API_BASE_URL = "http://192.168.1.7:8080"

export async function fetchExpenses() {
    const accessToken = useAuthStore.getState().accessToken;

    const response = await fetch(
        `${API_BASE_URL}/api/v1/expenses`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        }
    )

    if (!response.ok) {
        throw new Error("Unable to fetch expenses")
    }

    const data:unknown = await response.json();

    return expensesResponseSchema.parse(data)

}