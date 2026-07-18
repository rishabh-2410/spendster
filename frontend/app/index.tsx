import { Redirect} from "expo-router";

import { useAuthStore } from "@/store/auth.store";

export default function Index() {
    const accessToken = useAuthStore((state) => state.accessToken)

    const isSignedIn = !!accessToken

    if (isSignedIn) {
        return <Redirect href="/(tabs)" />
    }

    return <Redirect href="/(auth)/login" />
   
}