import { useMutation } from "@tanstack/react-query";

import { refreshUser } from "@/services/auth.services";

export function useRefresh() {
    return useMutation({
        mutationFn: refreshUser,
    })
}