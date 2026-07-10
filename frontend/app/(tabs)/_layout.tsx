import { useAuthStore } from '@/store/auth.store';
import { Tabs, Redirect } from 'expo-router';
import React from 'react';


export default function TabLayout() {

  const isSignedIn = useAuthStore((state) => state.isSignedIn)
  const isLoading = useAuthStore((state) => state.isLoading)

  if (isLoading) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/login" />
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="expense"
        options={{
          title: 'Expense',
        }}
      />
    </Tabs>
  );
}
