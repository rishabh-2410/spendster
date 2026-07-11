import { fetchStats } from "@/services/stats.service";
import { useQuery } from "@tanstack/react-query";

export function useStats() {
    return useQuery({
        queryKey: ["stats"],
        queryFn: fetchStats
    })
}