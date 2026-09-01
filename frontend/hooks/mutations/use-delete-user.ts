import { useMutation } from "@tanstack/react-query"
import { deleteUser } from "@/services/auth.service"

export const useDeleteUser = () => {
    return useMutation({
        mutationFn: deleteUser,
    })
}