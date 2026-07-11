import { useMutation } from "@tanstack/react-query";

import { refreshUser } from "@/services/auth.service";

export function useRefresh() {
    return useMutation({
        mutationFn: refreshUser,
    })
}