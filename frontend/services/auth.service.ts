import {
  LoginRequest,
  RefreshRequest,
  loginResponseSchema,
  RegisterRequest,
  LogoutRequest,
} from "@/schemas/auth.schema";
import { useAuthStore } from "@/store/auth.store";
import { API_URL } from "@/utils/helper";



export async function loginUser(request: LoginRequest) {
    const loginUrl = `${API_URL}/api/v1/auth/login`
    let response: Response
    try {
        response = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        })
    } catch (error) {
        throw error
    }

    if (!response.ok) {
        throw new Error("Login failed")
    }

    const data: unknown = await response.json()

    return loginResponseSchema.parse(data)
}


export async function registerUser(request: RegisterRequest) {

    console.log("request", request)
    const response = await fetch(
        `${API_URL}/api/v1/auth/register`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        }
    )
    if (!response.ok) {
        console.log(response.status)
        throw new Error("Unable to register user")
    }
}


export async function refreshUser(request: RefreshRequest) {
    console.log("Refresh request", request)


    const response = await fetch(
           `${API_URL}/api/v1/auth/refresh`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request)
        }
    )

    if (!response.ok) {
        console.log("refresh response code", response.status)
        throw new Error("Please login again to continue")
    }

    const data: unknown = await response.json()

    return loginResponseSchema.parse(data)


}


export async function logoutUser(request: LogoutRequest) {
    const accessToken = useAuthStore.getState().accessToken

    const response = await fetch(
        `${API_URL}/api/v1/auth/logout`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(request)
        }
    )

    if(!response.ok) {
        console.log("erro whiel logging out status", response.status)
        throw new Error("Unable to logout")
    }
}
