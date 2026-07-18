import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

import { useEffect, useState } from 'react';

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from '@/lib/query-client';
import { restoreSession } from '@/services/session.service';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAuthStore } from '@/store/auth.store';

import {
  LeagueSpartan_300Light,
  LeagueSpartan_400Regular,
  LeagueSpartan_500Medium,
  LeagueSpartan_600SemiBold,
  LeagueSpartan_700Bold,
  LeagueSpartan_800ExtraBold,
} from "@expo-google-fonts/league-spartan";
// import { useAuthStore } from '@/store/auth.store';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [sessionReady, setSessionReady] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isSignedIn = !!accessToken;


  const [fontsLoaded] = useFonts({
    LeagueSpartan_700Bold,
    'sans-medium': LeagueSpartan_500Medium,
    'sans-regular': LeagueSpartan_400Regular,
    'sans-semibold': LeagueSpartan_600SemiBold,
    'sans-extrabold': LeagueSpartan_800ExtraBold,
    'sans-light': LeagueSpartan_300Light
  })

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        await restoreSession()
      } finally {
        if (mounted) {
          setSessionReady(true)
        }
      }
    }

    bootstrap();

    // Cleanup
    return () => {
      mounted = false
    }

  }, []);


  useEffect(() => {
    if (fontsLoaded && sessionReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, sessionReady])

  if (!fontsLoaded || !sessionReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <ThemeProvider value={DefaultTheme}>
              <Stack
                key={isSignedIn ? "app-stack" : "auth-stack"}
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="index" />
                {isSignedIn ? (
                  <Stack.Screen name="(tabs)" />
                ) : (
                  <Stack.Screen name="(auth)" />
                )}
              </Stack>
            <StatusBar style="dark" />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
