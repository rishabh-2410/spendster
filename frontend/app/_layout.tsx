import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {  SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

import { useEffect } from 'react';

import { QueryClientProvider} from "@tanstack/react-query";
import { queryClient } from '@/lib/query-client';



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
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  },[fontsLoaded])

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
