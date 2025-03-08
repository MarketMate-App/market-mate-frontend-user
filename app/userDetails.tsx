import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";

const AdditionalDetails = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleContinue = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    Alert.alert("Success!", "Your details have been added.");
    router.push("/"); // Update the route as needed
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        className="flex-1 bg-white p-5 justify-between"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Stack.Screen
          options={{
            headerShown: false,
            title: "OTP",
          }}
        />
        <View>
          <Text
            className="text-3xl mb-3"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Tell Us About Yourself
          </Text>
          <Text
            className="text-gray-500 text-xs mb-8"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Please enter your details below.
          </Text>

          <View className="flex-row items-center border border-gray-200 rounded-2xl w-full mb-2">
            <FloatingLabelInput
              label="First Name"
              labelStyles={{
                fontFamily: "Unbounded Light",
                color: "#e5e7eb",
                paddingHorizontal: 3,
                fontSize: 12,
              }}
              inputStyles={{
                fontFamily: "Unbounded Regular",
                color: "#4b5563",
                fontSize: 13,
                paddingLeft: 10,
              }}
              customLabelStyles={{ colorFocused: "#9ca3af" }}
              value={firstName}
              animationDuration={50}
              hintTextColor={"#9ca3af"}
              hint="John"
              keyboardType="default"
              onChangeText={setFirstName}
              containerStyles={{
                paddingVertical: Platform.OS === "ios" ? 20 : 15,
              }}
              returnKeyType="next"
            />
          </View>

          <FloatingLabelInput
            label="Last Name"
            labelStyles={{
              fontFamily: "Unbounded Light",
              color: "#e5e7eb",
              paddingHorizontal: 3,
              fontSize: 12,
            }}
            inputStyles={{
              fontFamily: "Unbounded Regular",
              color: "#4b5563",
              fontSize: 13,
              paddingLeft: 10,
            }}
            customLabelStyles={{ colorFocused: "#9ca3af" }}
            value={lastName}
            animationDuration={50}
            hintTextColor={"#9ca3af"}
            hint="Doe"
            keyboardType="default"
            onChangeText={setLastName}
            containerStyles={{
              paddingVertical: Platform.OS === "ios" ? 20 : 15,
            }}
            returnKeyType="next"
          />

          <FloatingLabelInput
            label="Email"
            labelStyles={{
              fontFamily: "Unbounded Light",
              color: "#e5e7eb",
              paddingHorizontal: 3,
              fontSize: 12,
            }}
            inputStyles={{
              fontFamily: "Unbounded Regular",
              color: "#4b5563",
              fontSize: 13,
              paddingLeft: 10,
            }}
            customLabelStyles={{ colorFocused: "#9ca3af" }}
            value={email}
            animationDuration={50}
            hintTextColor={"#9ca3af"}
            hint="example@example.com"
            keyboardType="email-address"
            onChangeText={setEmail}
            containerStyles={{
              paddingVertical: Platform.OS === "ios" ? 20 : 15,
            }}
            returnKeyType="done"
          />

          <Pressable
            onPress={handleContinue}
            className="w-full mt-4 bg-[#2BCC5A] py-5 rounded-full border border-white"
            style={{ backgroundColor: "#2BCC5A" }}
          >
            <Text
              className="text-white text-xs text-center"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              Continue
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AdditionalDetails;
