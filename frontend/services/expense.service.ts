import {  
    AddExpenseRequestObject, 
    EditExpenseMutationRequest, 
    expenseSchema, 
    expensesResponseSchema } from "@/schemas/expense.schema";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/utils/helper";


export async function fetchExpenses() {
    const accessToken = useAuthStore.getState().accessToken;

    const response = await fetch(
        `${API_URL}/api/v1/expenses`,{
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


export async function addExpense(request:AddExpenseRequestObject) {
    const accessToken = useAuthStore.getState().accessToken

    const response = await fetch(
        `${API_URL}/api/v1/expenses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(request)
        }
    )

    if (!response.ok) {
        console.log("Adding expense error status", response.status)
        throw new Error("Unable to add expense")
    }

    const data:unknown = await response.json()

    console.log(data)

    return expenseSchema.parse(data);
}


export async function deleteExpense(expenseID: string) {
    const access_token = useAuthStore.getState().accessToken

    const response = await fetch(
        `${API_URL}/api/v1/expenses/${expenseID}`,{
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        }
    )

    if (!response.ok) {
        console.log("delete expense error status", response.status)
        throw new Error("Unable to delete expense")
    }
} 



export async function editExpense( editRequest: EditExpenseMutationRequest) {

    const accessToken = useAuthStore.getState().accessToken

    console.log("edit request payload:", editRequest)

    const response = await fetch(
        `${API_URL}/api/v1/expenses/${editRequest.expenseID}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(editRequest.editRequest)
        }
    )

    if (!response.ok) {
        console.log("edit expense error status", response.status)
        throw new Error("Unable to edit expense")
    }

    const data:unknown = await response.json()

    return expenseSchema.parse(data)


}