import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "Gilroy Regular": require("../assets/fonts/Gilroy-Regular.ttf"),
    "Gilroy Medium": require("../assets/fonts/Gilroy-Medium.ttf"),
    "Gilroy Bold": require("../assets/fonts/Gilroy-Bold.ttf"),
    "Plus Jakarta Sans Regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Plus Jakarta Sans Medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Plus Jakarta Sans Bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
