import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const LocationScreen = () => {
  return (
    <View className="p-3 bg-white flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Text>LocationScreen</Text>
    </View>
  );
};

export default LocationScreen;
