import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useEffect, useRef, useState } from "react";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { useAuthStore } from "@/store/auth.store";

import AddExpenseSheet from "@/components/expense/AddExpenseSheet";
import { BlurView } from "expo-blur";


export default function TabLayout() {
 const accessToken = useAuthStore((state) => state.accessToken);
const addBottomSheetRef = useRef<BottomSheetModal>(null);
const [sheetReady, setSheetReady] = useState<boolean>(false)
const isSignedIn = !!accessToken

useEffect(() => {
  const id = requestAnimationFrame(() => {
    setSheetReady(true)
  })

  return () => cancelAnimationFrame(id)
})


 if (!isSignedIn) {
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
              intensity={70}
              style={{
                flex: 1,
                borderRadius: 28,
                overflow: "hidden",
              }}
            />
          ),

          tabBarStyle: {
            position: "absolute",
            // borderColor: 'red',
            // borderWidth: 2,
            marginBottom: 30,
            marginHorizontal: 30,
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
          listeners={{
            tabPress: (e) => {
              e.preventDefault()
              addBottomSheetRef.current?.present()
            }
          }}
          options={{
            tabBarIcon: ({color, focused}) => (
    
                <Ionicons
                  name="add-circle-outline"
                  size={30}
                  color={color}
           
                />
  
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

      {sheetReady ? <AddExpenseSheet ref={addBottomSheetRef} /> : null}
    </>
  );
}