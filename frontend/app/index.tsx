import { Redirect} from "expo-router";

import { useAuthStore } from "@/store/auth.store";

export default function Index() {
    const isSignedIn = useAuthStore((state) => state.isSignedIn)

    const isLoading = useAuthStore((state) => state.isLoading)

    if (isLoading) {
        return null;
    }

    if (isSignedIn) {
        return <Redirect href="/(tabs)" />
    }


    return <Redirect href="/(auth)/register" />
}