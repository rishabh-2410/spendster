import { Redirect, Stack } from 'expo-router';

import { userAuthStore } from '@/store/auth.store';


export default function AuthLayout() {

    const isSignedIn = userAuthStore((state) => state.isSignedIn)
    const isLoading = userAuthStore((state) => state.isLoading)


    if (isLoading) {
        return null;
    }

    if (isSignedIn) {
        return <Redirect href="/(tabs)"/>
    }

return ( 
    <Stack screenOptions={{headerShown: false}} />
)
}