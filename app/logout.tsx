import React, { useEffect } from "react";
import { View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import * as Updates from "expo-updates";

const logout = () => {
  const clearStorageAndRestart = async () => {
    try {
      const userLocation = await SecureStore.getItemAsync("userLocation");
      const token = await SecureStore.getItemAsync("jwtToken");
      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Clear SecureStore
      await SecureStore.deleteItemAsync("jwtToken");

      await SecureStore.deleteItemAsync("userLocation");

      // Restart the app
      if (Updates.reloadAsync) {
        console.log(token);
        console.log(userLocation);

        if (token && userLocation) {
          await SecureStore.deleteItemAsync("jwtToken");

          await SecureStore.deleteItemAsync("userLocation");
        } else {
          await Updates.reloadAsync();
        }
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    clearStorageAndRestart();
  }, []);

  return (
    <View>
      <Text>Logging out...</Text>
    </View>
  );
};

export default logout;
