import { useMutation } from "@tanstack/react-query";


import { registerUser } from "@/services/auth.services";


export function useRegister() {
    return useMutation({
        mutationFn: registerUser
    })
}