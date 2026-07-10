import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { router, SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

import { useEffect } from 'react';

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from '@/lib/query-client';
import { useAuthStore } from '@/store/auth.store';
import { getRefreshToken, saveRefreshToken } from '@/store/token.store';
import { useRefresh } from '@/hooks/mutations/use-refresh';
import { LoginResponse, refreshRequestSchema } from '@/schemas/auth.schema';
import { AuthUser } from '@/types/auth.types';
import { restoreSession } from '@/services/session.service';



export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {


  const [fontsLoaded] = useFonts({
    'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf')
  })

  useEffect(() => {
    restoreSession();
  }, []);


  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null;
  }




  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
