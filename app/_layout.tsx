import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "WorkSans Regular": require("../assets/fonts/Syne-Regular.ttf"),
    "WorkSans Medium": require("../assets/fonts/Syne-Medium.ttf"),
    "WorkSans Bold": require("../assets/fonts/Syne-Bold.ttf"),
    "WorkSans SemiBold": require("../assets/fonts/Syne-SemiBold.ttf"),
    "WorkSans Light": require("../assets/fonts/Syne-Medium.ttf"),
  });

  useEffect(() => {
    const checkFirstTimeUser = async () => {
      if (Platform.OS === "ios") {
        router.replace("/(tabs)/shop");
      }
      const isFirstTime = await AsyncStorage.getItem("isFirstTimeUser");
      if (isFirstTime === null) {
        // First time user
        await AsyncStorage.setItem("isFirstTimeUser", "false");
        router.replace("/");
      } else {
        // Not first time user
        router.replace("/(tabs)/shop");
      }
    };

    if (loaded) {
      SplashScreen.hideAsync();
      checkFirstTimeUser();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth"
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          statusBarBackgroundColor: "transparent",
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          headerShadowVisible: false,
          headerTitle: "",
          statusBarBackgroundColor: "transparent",
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerTitle: "",
        }}
      />
      <Stack.Screen name="location" options={{ headerShown: false }} />
      <Stack.Screen
        name="screens/search"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
