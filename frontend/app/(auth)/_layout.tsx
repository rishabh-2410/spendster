import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/store/auth.store';


export default function AuthLayout() {

  const accessToken = useAuthStore(
    (state) => state.accessToken
  );
    const isLoading = useAuthStore((state) => state.isLoading)

  const isSignedIn = !!accessToken
  
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