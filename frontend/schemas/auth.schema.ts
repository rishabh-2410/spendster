import {z} from "zod";

export const registerRequestSchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8, "Password must be atleast 8 characters")
})

export const loginRequestSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be atleast 8 characters"),
});

export const loginResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    created_at: z.string(),
    access_token: z.string(),
    refresh_token: z.string(),
})

export const refreshRequestSchema = z.object({
  refresh_token: z.string(),
})




export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export type RefreshRequest = z.infer<typeof refreshRequestSchema>;


export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export type RegisterErrors = {
  name?: string;
  email?: string;
  password?: string;
};

export type LoginErrors = {
  email?: string;
  password?: string;
};




export const logoutSchema = z.object({
  refresh_token: z.string({error: "required token for logout"})
})

export type LogoutRequest = z.infer<typeof logoutSchema>