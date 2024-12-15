import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { set } from "react-hook-form";
import { router } from "expo-router";

const RegistrationScreen = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isPosting, setIsPosting] = useState(false);

  const validateForm = () => {
    let errors = {};
    if (!firstName) {
      setError({ firstName: "First Name is required" });
      return false;
    }
    if (!lastName) {
      setError({ lastName: "Last Name is required" });
      return false;
    }
    if (!email) {
      setError({ email: "Email is required" });
      return false;
    }
    if (!password) {
      setError({ password: "Password is required" });
      return false;
    }
    if (!confirmPassword) {
      setError({ confirmPassword: "Confirm Password is required" });
      return false;
    }
    if (password !== confirmPassword) {
      setError({ confirmPassword: "Passwords do not match" });
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
      setFirstname("");
      setLastname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError({});
      console.log(firstName, lastName, email, password, confirmPassword);
      createAccount();
    }
  };

  const createAccount = async () => {
    setIsPosting(true);
    try {
      const response = await fetch(
        "http://192.168.43.155:8080/auth/v1/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email,
            password,
            confirmPassword,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log("Account created successfully");
        if (data.jwt) {
          router.push("/login");
        }
      }
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsPosting(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled
      className="bg-white flex-1 p-4 justify-end"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TextInput
        className="border-b-hairline p-1 border-gray-700 mb-10 text-xl text-gray-700"
        style={{ fontFamily: "Gilroy Medium" }}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstname}
      />
      {error.firstName && (
        <Text
          className="text-red-500 text-sm mb-2"
          style={{ fontFamily: "Gilroy Regular" }}
        >
          {error.firstName}
        </Text>
      )}
      <TextInput
        className="border-b-hairline p-1 border-gray-700 mb-10 text-xl text-gray-700"
        style={{ fontFamily: "Gilroy Medium" }}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastname}
      />
      {error.lastName && (
        <Text
          className="text-red-500 text-sm mb-2"
          style={{ fontFamily: "Gilroy Regular" }}
        >
          {error.lastName}
        </Text>
      )}
      <TextInput
        className="border-b-hairline p-1 border-gray-700 mb-10 text-xl text-gray-700"
        style={{ fontFamily: "Gilroy Medium" }}
        placeholder="Email"
        autoCorrect={false}
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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

      <View className="flex-row items-center border-b-hairline border-gray-700 mb-10">
        <TextInput
          className="p-1 text-xl text-gray-700 flex-1"
          style={{ fontFamily: "Gilroy Medium" }}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </Pressable>
      </View>
      {error.confirmPassword && (
        <Text
          className="text-red-500 text-sm mb-2"
          style={{ fontFamily: "Gilroy Regular" }}
        >
          {error.confirmPassword}
        </Text>
      )}

      <Pressable
        className="w-92 m-auto bg-black px-8 py-5 rounded-full mb-4"
        onPress={handleSubmit}
        disabled={isPosting}
      >
        <Text
          className="text-center text-lg text-white"
          style={{ fontFamily: "Gilroy Bold" }}
        >
          {isPosting ? "Creating Account..." : "Create Account"}
        </Text>
      </Pressable>

      <Text
        className="text-center text-sm text-gray-400 mb-2"
        style={{ fontFamily: "Gilroy Regular" }}
      >
        By clicking "Create Account" you agree to our Terms and Conditions.
      </Text>
    </KeyboardAvoidingView>
  );
};

export default RegistrationScreen;
