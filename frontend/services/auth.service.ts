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
    const startedAt = Date.now()

    console.log("Request for login:", request)
    console.log("Login request started at:", new Date(startedAt).toISOString())
    console.log("API_URL =", process.env.EXPO_PUBLIC_API_URL)
    console.log("Login URL =", loginUrl)

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
        const requestDurationMs = Date.now() - startedAt
        console.log("Login request threw before response")
        console.log("Login request duration(ms):", requestDurationMs)
        console.log("Login request error object:", error)

        if (error instanceof Error) {
            console.log("Login request error name:", error.name)
            console.log("Login request error message:", error.message)
            console.log("Login request error stack:", error.stack)
        }

        throw error
    }

    console.log("Login response received in(ms):", Date.now() - startedAt)
    console.log("Login response status:", response.status)
    console.log("Login response ok:", response.ok)
    console.log("Login response content-type:", response.headers.get("content-type"))

    if (!response.ok) {
        console.log("Login failed code", response.status)
        throw new Error("Login failed")
    }

    const data: unknown = await response.json()

    console.log("Login response data:", data)

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
