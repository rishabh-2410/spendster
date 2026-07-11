import { useAuthStore } from "@/store/auth.store";
import { deleteRefreshToken, getRefreshToken, saveRefreshToken } from "@/store/token.store";
import { refreshUser } from "./auth.service";

  export async function restoreSession() {

    const {
    setSession,
    clearSession,
    setLoading,
  } = useAuthStore.getState();


   setLoading(true);


   try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      clearSession();
      return;
    }

    const data = await refreshUser({
        "refresh_token": refreshToken
    });

    await saveRefreshToken(data.refresh_token);

    setSession(
      {
        id: data.id,
        name: data.name,
        email: data.email,
        created_at: data.created_at,
      },
      data.access_token
    );
  } catch (error) {
    console.log("error setting session", error)
    await deleteRefreshToken();
    clearSession();
  } finally {
    setLoading(false);
  }
}
