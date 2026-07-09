import { create } from "zustand";


type AuthUser = {
   id: string;
   name: string;
   email: string;
   created_at: string;
}


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


export const userAuthStore = create<AuthState>((set) => ({
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