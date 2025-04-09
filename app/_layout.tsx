import { router, Stack } from "expo-router";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Gilroy Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy Medium": require("../assets/fonts/Gilroy-Medium.ttf"),
    "Gilroy Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
    "Unbounded Bold": require("../assets/fonts/Unbounded-Bold.ttf"),
    "Unbounded Regular": require("../assets/fonts/Unbounded-Regular.ttf"),
    "Unbounded Medium": require("../assets/fonts/Unbounded-Medium.ttf"),
    "Unbounded SemiBold": require("../assets/fonts/Unbounded-SemiBold.ttf"),
    "Unbounded Light": require("../assets/fonts/Unbounded-Light.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      router.push("/(tabs)/shop");
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
