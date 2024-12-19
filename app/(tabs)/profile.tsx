// UserPreferences.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserPreferences = () => {
  const [name, setName] = useState("");
  const [storedName, setStoredName] = useState("");

  // Load the name from AsyncStorage when the component mounts
  useEffect(() => {
    const loadName = async () => {
      try {
        const value = await AsyncStorage.getItem("userName");
        if (value !== null) {
          setStoredName(value);
        }
      } catch (error) {
        console.error("Failed to load name from AsyncStorage:", error);
      }
    };

    loadName();
  }, []);

  // Function to save the name to AsyncStorage
  const saveName = async () => {
    try {
      await AsyncStorage.setItem("userName", name);
      setStoredName(name);
      setName(""); // Clear the input field
    } catch (error) {
      console.error("Failed to save name to AsyncStorage:", error);
    }
  };

  // Function to remove the name from AsyncStorage
  const removeName = async () => {
    try {
      await AsyncStorage.removeItem("userName");
      setStoredName("");
    } catch (error) {
      console.error("Failed to remove name from AsyncStorage:", error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Stored Name: {storedName}</Text>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
      />
      <Button title="Save Name" onPress={saveName} />
      <Button title="Remove Name" onPress={removeName} />
    </View>
  );
};

export default UserPreferences;
