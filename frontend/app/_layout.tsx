import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';

import { useEffect } from 'react';

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from '@/lib/query-client';
import { restoreSession } from '@/services/session.service';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  LeagueSpartan_300Light,
  LeagueSpartan_400Regular,
  LeagueSpartan_500Medium,
  LeagueSpartan_600SemiBold,
  LeagueSpartan_700Bold,
  LeagueSpartan_800ExtraBold,
} from "@expo-google-fonts/league-spartan";



export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {


  const [fontsLoaded] = useFonts({LeagueSpartan_700Bold,
    'sans-medium': LeagueSpartan_500Medium,
    'sans-regular': LeagueSpartan_400Regular,
    'sans-semibold': LeagueSpartan_600SemiBold,
    'sans-extrabold': LeagueSpartan_800ExtraBold,
    'sans-light': LeagueSpartan_300Light
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
