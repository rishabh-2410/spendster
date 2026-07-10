import { AuthUser } from "@/types/auth.types";
import { create } from "zustand";

type AuthState = {
    user: AuthUser | null;
    accessToken: string | null;
    isSignedIn: boolean;
    isLoading: boolean;

    setSession: (
         user: AuthUser,
        accessToken: string,
    ) => void;

    clearSession: () => void;
    setLoading: (loading: boolean) => void;
}


export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,

    isSignedIn: false,
    isLoading: false,
     setSession: (user, accessToken) => set({
        user, accessToken, isSignedIn: true,
     }),
     clearSession: () => set ({
        user: null,
        accessToken: null,
        isSignedIn: false
     }),
     setLoading: (loading) => set({
        isLoading: loading,
     })

}));