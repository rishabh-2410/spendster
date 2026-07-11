import { z} from "zod"

export const statsResponseSchema = z.object({
    today_spent: z.number(),
    monthly_spent: z.number(),
    total_expenses: z.number(),
})

export type StatsResponse = z.infer<typeof statsResponseSchema>