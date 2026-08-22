import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DefaultTheme, SplashScreen, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import 'react-native-reanimated';
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useEffect, useState } from 'react';

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from '@/lib/query-client';
import { restoreSession } from '@/services/session.service';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useAuthStore } from '@/store/auth.store';
import { registerForPushNotifications, savePushToken } from '@/services/notification.service';

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
    if (!isSignedIn) {
      return;
    }

    let active = true;

    async function registerPushToken() {
      const token = await registerForPushNotifications();
      if (!active || !token) {
        return;
      }

      try {
        await savePushToken(token);
      } catch (error) {
        console.warn("Unable to register push notifications.", error);
      }
    }

    registerPushToken();

    const subscription = Notifications.addPushTokenListener(({ data }) => {
      savePushToken(data).catch((error) => {
        console.warn("Unable to update push notification token.", error);
      });
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, [isSignedIn]);


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
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID="keyboard-done">
          <View style={keyboardDoneStyles.bar}>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
              }}
              hitSlop={12}
            >
              <Text style={keyboardDoneStyles.done}>Done</Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </GestureHandlerRootView>
  );
}

const keyboardDoneStyles = StyleSheet.create({
  bar: {
    backgroundColor: "#EFE9D5",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D8D2BE",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  done: {
    color: "#EA7A53",
    fontFamily: "sans-semibold",
    fontSize: 16,
  },
});
