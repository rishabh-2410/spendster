import { View, Text, Pressable, FlatList, StyleSheet, Alert } from 'react-native'
import React, { useRef } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/store/auth.store'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { getRefreshToken } from '@/store/token.store'
import { useLogout } from '@/hooks/mutations/use-logout'
import { LogoutRequest } from '@/schemas/auth.schema'
import PrivacyPolicySheet from '@/components/settings/PrivacyPolicySheet'
import AboutSheet from '@/components/settings/AboutSheet'
import { useDeleteUser } from '@/hooks/mutations/use-delete-user'

const SettingsScreen = () => {

  const clearSession = useAuthStore.getState().clearSession
  const privacyPolicySheet =useRef<BottomSheetModal>(null);
  const aboutSheet =useRef<BottomSheetModal>(null);
  const deleteAccountMutation = useDeleteUser()

  const logoutMutation = useLogout()
  
  function handlePrivacySettings() {
    privacyPolicySheet.current?.present()
  }

  function handleAccountSettings() {
    privacyPolicySheet.current?.present()
  }

  function handleAbout() {
    aboutSheet.current?.present()
  }

  function handleDeleteAccount() {
    Alert.alert("Delete Account", "Are you sure you want to delete your account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
        deleteAccountMutation.mutate(undefined, {
          onSuccess: () => {
            clearSession()
          },
          onError: (error:any) => {
            console.log("error in deleting account", error)
            Alert.alert("Error", "Failed to delete account")
          }
        })
      } },
    ])
  }

  async function handleLogout() {
    const token = await getRefreshToken()

    if (!token) {
      console.log("no refresh token found")
      return 
    }
    const request:LogoutRequest = {
      refresh_token: token
    }


    logoutMutation.mutate(request, {
      onSuccess: () => {
        clearSession()
      },
      onError: (error:any) => {
        console.log("error in logging out", error)
      }
    })
  }


  const user = useAuthStore.getState().user
  return (
    <SafeAreaView style={styles.safeArea}>
  <FlatList
    data={[
      { id: "1", title: "Privacy Policy", icon: "shield-outline", onpress: handlePrivacySettings},
      { id: "2", title: "About", icon: "information-circle-outline", onpress: handleAbout},
    ]}
    keyExtractor={(item) => item.id}
    showsVerticalScrollIndicator={false}
    ListHeaderComponent={
      <>
        <Text style={styles.heading}>Profile</Text>

        <View style={styles.profileCard}>

          <Text style={styles.name}>
            {user ? user?.name?.charAt(0)?.toUpperCase() + user?.name?.slice(1) : "Unnamed user"}
          </Text>

          <Text style={styles.email}>
            {user ? user.email :"" }
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          SETTINGS
        </Text>
      </>
    }
    renderItem={({ item }) => (
      <Pressable style={styles.settingItem} onPress={item.onpress}>
        <View style={styles.settingLeft}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color="#081126"
            />
          </View>

          <Text style={styles.settingText}>
            {item.title}
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color="#8A8A8A"
        />
      </Pressable>
    )}
    ListFooterComponent={
      <View>
        <Pressable
          onPress={handleLogout} 
          style={({pressed}) => [
            styles.logoutButton,
            pressed ? {opacity: 0.45} : null
        ]}>
          <Ionicons
            name="log-out-outline"
            size={22}
            color="#081126"
          />
          <Text style={styles.logoutText}>
            Log Out
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDeleteAccount}
          style={({pressed}) => [
            styles.deleteAccountButton,
            pressed ? {opacity: 0.45} : null
        ]}>
          <Ionicons
            name="trash-outline"
            size={22}
            color="#BA1A1A"
          />
          <Text style={styles.deleteAccountText}>
            Delete Account
          </Text>
        </Pressable>
      </View>
    }
    contentContainerStyle={{
      padding: 24,
      paddingBottom: 40,
    }}
  />

  <PrivacyPolicySheet ref={privacyPolicySheet} />
  <AboutSheet ref={aboutSheet} />
</SafeAreaView>
  )
}

export default SettingsScreen


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFF9E7",
  },

  heading: {
    fontSize: 32,
    fontFamily: "sans-bold",
    color: "#081126",
    marginBottom: 24,
  },

  profileCard: {
    backgroundColor: "#F7F0D8",
    borderRadius: 32,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 36,
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#FFF9E7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  name: {
    fontSize: 22,
    fontFamily: "sans-bold",
    color: "#081126",
  },

  email: {
    marginTop: 6,
    fontSize: 15,
    fontFamily: "sans-medium",
    color: "#6B6B6B",
  },

  sectionTitle: {
    fontSize: 12,
    fontFamily: "sans-bold",
    color: "#7C7C7C",
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },

  settingItem: {
    height: 72,
    backgroundColor: "#F7F0D8",
    borderRadius: 20,
    paddingHorizontal: 18,
    marginBottom: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFF9E7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  settingText: {
    fontSize: 16,
    fontFamily: "sans-semibold",
    color: "#081126",
  },

  logoutButton: {
    marginTop: 28,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#081126",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  logoutText: {
    fontSize: 16,
    fontFamily: "sans-bold",
    color: "#081126",
  },

  deleteAccountButton: {
    marginTop: 14,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#BA1A1A",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  deleteAccountText: {
    fontSize: 16,
    fontFamily: "sans-bold",
    color: "#BA1A1A",
  },
});