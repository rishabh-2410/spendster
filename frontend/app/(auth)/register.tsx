import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, router } from 'expo-router'
import { Image } from 'expo-image'
import { useRegister } from '@/hooks/mutations/use-register'
import { RegisterErrors, registerRequestSchema } from '@/schemas/auth.schema'
import { registerStyles as styles } from "@/styles/global.styles";

export default function RegisterScreen() {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<RegisterErrors>({});

  const registerMutation = useRegister();

  const handleRegister = () => {

    setErrors({});
    const result = registerRequestSchema.safeParse({
      name,
      email,
      password
    })


    console.log("Name", name)
    console.log("Email", email)
    console.log("Password", password)

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });


      return;
    }

    registerMutation.mutate(result.data, {
      onSuccess: () => {
        router.navigate("/(auth)/login")
      },
      onError: (error) => {
        console.log(error)
      }
    })
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
            <Text style={styles.title}>Create account</Text>

            <Text style={styles.subtitle}>
              Start managing your expenses effectively today.
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.label}>NAME</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder='Enter your name'
                    placeholderTextColor={"#7b7b7b"}
                    autoCapitalize='words'
                  />
                </View>

              </View>

              {errors.name && (
                <Text style={styles.error}>
                  {errors.name}
                </Text>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>EMAIL</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder='you@example.com'
                    placeholderTextColor={"#7b7b7b"}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}

                  />
                </View>

              </View>

              {errors.email && (
                <Text style={styles.error}>
                  {errors.email}
                </Text>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder='Create a password'
                    placeholderTextColor={"#7b7b7b"}
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry
                  />
                </View>

              </View>

              {errors.password && (
                <Text style={styles.error}>
                  {errors.password}
                </Text>
              )}

              {/* <Text style={styles.helper}>
                Use at least 8 characters.
              </Text> */}

            </View>

            {registerMutation.isError && (
              <Text style={styles.error}>
                {registerMutation.error.message}
              </Text>
            )}


            <Pressable
              style={[
                styles.primaryButton,
                registerMutation.isPending && styles.primaryButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={registerMutation.isPending}
            >
              <Text style={styles.primaryButtonText}>
                {registerMutation.isPending ? "Creating account..." : "Create account"}
              </Text>
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?
              </Text>

              <Pressable
                onPress={() => {
                  console.log("clicked log in button on register screen")
                  router.replace("/(auth)/login")
                }}
              >
                <Text style={styles.link}>Log in</Text>
              </Pressable>

              {/* <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text style={styles.link}>Log in</Text>
                </Pressable>
              </Link> */}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}
