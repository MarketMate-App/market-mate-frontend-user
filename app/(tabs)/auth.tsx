import { View, Text, StatusBar, Platform } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthScreen = () => {
  return (
    <View className="p-3 bg-white flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      {/* <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} /> */}
      <Text>AuthScreen</Text>
    </View>
  );
};

export default AuthScreen;
