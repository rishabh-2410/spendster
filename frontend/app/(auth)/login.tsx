import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { registerStyles as styles } from "@/styles/global.styles";
import { Image } from "expo-image";
import { useState } from "react";
import { useLogin } from "@/hooks/mutations/use-login";
import { LoginErrors, loginRequestSchema, LoginResponse } from "@/schemas/auth.schema";
// import { routePatternToRegex } from "expo-router/build/fork/getStateFromPath-forks";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { AuthUser } from "@/types/auth.types";
import { saveRefreshToken } from "@/store/token.store";
// import { useMutation } from "@tanstack/react-query";
// import { loginUser } from "@/services/auth.service";

export default function LoginScreen() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<LoginErrors>({})

  const setSession = useAuthStore((state) => state.setSession)



  const loginMutation = useLogin()

  const handleLogin = () => {
    setErrors({})

    const result = loginRequestSchema.safeParse({
      email,
      password
    })

    console.log("Email: ", email)
    console.log("Password", password)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;


      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0]
      })

      return;
    }

    loginMutation.mutate(result.data, {
      onSuccess: async (data: LoginResponse) => {
        // setLoading(true)
        await handleSession(data);
        // setLoading(false)
        router.navigate("/")
      },
      onError: (error) => {
        console.log(error)
      }
    })

  }


  const handleSession = async (data: LoginResponse) => {
    let user: AuthUser = {
      id: data.id,
      name: data.name,
      email: data.email,
      created_at: data.created_at
    }
    await saveRefreshToken(data.refresh_token)
    setSession(user, data.access_token)
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Image
                style={styles.logoMark}
                source={require('@/assets/spendster.png')}
              />
            </View>

            <Text style={styles.title}>Welcome back</Text>

            <Text style={styles.subtitle}>
              Log in to keep track of your spending.
            </Text>
          </View>




          <View style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>EMAIL</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#7b7b7b"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {errors.email && (<Text style={styles.error}>{errors.email}</Text>)}

              <View style={styles.field}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.label}>PASSWORD</Text>

                  <Pressable>
                    <Text style={styles.forgotPassword}>
                      Forgot password?
                    </Text>
                  </Pressable>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#7b7b7b"
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {errors.password && (<Text style={styles.error}>{errors.password}</Text>)}

              <Pressable style={styles.primaryButton} onPress={handleLogin} disabled={loginMutation.isPending}>
                <Text style={styles.primaryButtonText}>
                  {loginMutation.isPending
                    ? <ActivityIndicator size={14}/>
                    : "Login"}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don&apos;t have an account?
            </Text>

            <Pressable onPress={() => router.navigate("/(auth)/register")}>
              <Text style={styles.link}>Create account</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}