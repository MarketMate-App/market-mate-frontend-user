import React, { useEffect } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";
import { Stack } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

const logout = () => {
  const clearStorageAndRestart = async () => {
    try {
      const userLocation = await SecureStore.getItemAsync("userLocation");
      const token = await SecureStore.getItemAsync("jwtToken");
      // Clear AsyncStorage
      await AsyncStorage.multiRemove(["@phoneNumber", "@userDetails"]);

      // Clear SecureStore
      await SecureStore.deleteItemAsync("jwtToken");

      await SecureStore.deleteItemAsync("userLocation");

      // Restart the app
      if (Updates.reloadAsync) {
        // console.log("Token before logout:", token);
        // console.log("User location before logout:", userLocation);

        // Ensure sensitive data is cleared before restarting
        if (token || userLocation) {
          await SecureStore.deleteItemAsync("jwtToken");
          await SecureStore.deleteItemAsync("userLocation");
        }

        // Reload the app to apply changes
        await Updates.reloadAsync();
      } else {
        // console.warn("Updates.reloadAsync is not available.");
      }
    } catch (error) {
      // console.error("Error during logout:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      clearStorageAndRestart();
    }, [])
  );

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Text>Logging out...</Text>
    </View>
  );
};

export default logout;
