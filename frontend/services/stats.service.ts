// services/stats.service.ts

import { useAuthStore } from "@/store/auth.store";
import { statsResponseSchema } from "@/schemas/stats.schema";
import { API_URL } from "@/utils/helper";


export async function fetchStats() {
  const accessToken =
    useAuthStore.getState().accessToken;

  const response = await fetch(
    `${API_URL}/api/v1/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to fetch dashboard stats");
  }

  const data: unknown = await response.json();

  return statsResponseSchema.parse(data);
}