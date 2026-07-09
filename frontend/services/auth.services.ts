import {
  LoginRequest,
  LoginResponse,
  loginResponseSchema,
  RegisterRequest,
} from "@/schemas/auth.schema";


const API_URL = "http://192.168.1.7:8080"

export async function loginUser(request: LoginRequest) {
    const response = await fetch(`${API_URL}/api/auth/v1/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })

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