import { AuthUser } from "@/types/auth.types";
import { create } from "zustand";

type AuthState = {
    user: AuthUser | null;
    accessToken: string | null;

    setSession: (
         user: AuthUser,
        accessToken: string,
    ) => void;

    clearSession: () => void;
}


export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,

    isSignedIn: false,
     setSession: (user, accessToken) => set({
        user, accessToken
     }),
     clearSession: () => set ({
        user: null,
        accessToken: null,
     }),

}));