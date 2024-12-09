import { View, Text, Button } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
// Import your global CSS file
import "../global.css";

const RootLayout = () => {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Home",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerTitle: "Create Account",
          headerRight: () => (
            <Button
              title="Open Modal"
              onPress={() => {
                router.push("/modal");
              }}
            />
          ),
        }}
      />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RootLayout;
