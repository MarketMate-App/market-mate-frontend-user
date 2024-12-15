import { View, Text, Pressable, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let errors = {};

    if (!email) {
      setError({ email: "Email is required" });
      return false;
    }
    if (!password) {
      setError({ password: "Password is required" });
      return false;
    }

    if (password.length < 6) {
      setError({ password: "Password must be at least 6 characters" });
      return false;
    }
    if (password.length > 20) {
      setError({ password: "Password must be at most 20 characters" });
      return false;
    }

    // if (!/\d/.test(password)) {
    //   setError({ password: "Password must contain a number" });
    //   return false;
    // }
    // if (!/[a-z]/.test(password)) {
    //   setError({ password: "Password must contain a lowercase letter" });
    //   return false;
    // }
    // if (!/[A-Z]/.test(password)) {
    //   setError({ password: "Password must contain an uppercase letter" });
    //   return false;
    // }
    // if (!/[!@#$%^&*]/.test(password)) {
    //   setError({ password: "Password must contain a special character" });
    //   return false;
    // }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError({ email: "Email is invalid" });
      return false;
    }
    if (Object.keys(errors).length === 0) {
      setError({});
    }
    return true;
  };
  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form is valid");
      setEmail("");
      setPassword("");
      setError({});
      console.log(email, password);
      router.push("/home");
    }
  };

  return (
    <SafeAreaView className="bg-white flex-1 p-4">
      <TextInput
        className="border-b-hairline p-1 border-gray-700 mb-10 text-xl text-gray-700"
        style={{ fontFamily: "Gilroy Medium" }}
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {error.email && (
        <Text
          className="text-red-500 text-sm mb-2"
          style={{ fontFamily: "Gilroy Regular" }}
        >
          {error.email}
        </Text>
      )}
      <View className="flex-row items-center border-b-hairline border-gray-700 mb-10">
        <TextInput
          className="p-1 text-xl text-gray-700 flex-1"
          style={{ fontFamily: "Gilroy Medium" }}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </Pressable>
      </View>
      {error.password && (
        <Text
          className="text-red-500 text-sm mb-2"
          style={{ fontFamily: "Gilroy Regular" }}
        >
          {error.password}
        </Text>
      )}
      <Pressable
        className="w-92 m-auto bg-black px-8 py-5 rounded-full mb-4"
        onPress={handleSubmit}
      >
        <Text
          className="text-center text-lg text-white"
          style={{ fontFamily: "Gilroy Bold" }}
        >
          Log in
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default LoginScreen;
