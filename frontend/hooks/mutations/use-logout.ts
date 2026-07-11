import { logoutUser } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
    return useMutation({
        mutationFn: logoutUser
    })
}