import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { useRef } from "react";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { useAuthStore } from "@/store/auth.store";

import AddExpenseSheet from "@/components/expense/AddExpenseSheet";
import { registerStyles } from "@/styles/global.styles";
import { Pressable } from "react-native";

export default function TabLayout() {
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  const isLoading = useAuthStore(
    (state) => state.isLoading
  );

  const bottomSheetRef =
    useRef<BottomSheetModal>(null);

  if (isLoading) {
    return null;
  }

  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarShowLabel: false,

          tabBarBackground: () => (
            <BlurView
              tint="systemChromeMaterial"
              intensity={90}
              style={{
                flex: 1,
                borderRadius: 28,
                overflow: "hidden",
              }}
            />
          ),

          tabBarStyle: {
            position: "absolute",

            margin: 30,
            height: 72,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",

            borderRadius: 28,

            borderTopWidth: 0,

            elevation: 0,

            backgroundColor: "transparent",

            shadowColor: "#000",

            shadowOpacity: 0.12,

            shadowRadius: 24,

            shadowOffset: {
              width: 0,
              height: 10,
            },
          },

          tabBarActiveTintColor: "#EA7A53",

          tabBarInactiveTintColor: "#6B7280",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={
                  focused ? "home" : "home-outline"
                }
                size={26}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="expense"
          options={{
            tabBarIcon: () => (
                <Pressable
                style={registerStyles.addButton}
                onPress={() =>
                  bottomSheetRef.current?.present()
                }
              >
                <Ionicons
                  name="add-circle"
                  size={32}
           
                />
              </Pressable>
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={
                  focused
                    ? "settings"
                    : "settings-outline"
                }
                size={26}
                color={color}
              />
            ),
          }}
        />
      </Tabs>

      <AddExpenseSheet ref={bottomSheetRef} />
    </>
  );
}