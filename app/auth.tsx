import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";

const AuthPage = () => {
  const [phone, setPhone] = useState("");

  const handleContinue = () => {
    // Remove any spaces from the input
    const cleanedPhone = phone.replace(/\s/g, "");
    // Validate that the number contains exactly 9 digits
    const ghanaianPhoneRegex = /^\d{9}$/;
    if (!ghanaianPhoneRegex.test(cleanedPhone)) {
      Alert.alert("Oops!", "Please enter a valid Ghanaian phone number.");
      return;
    }
    // Proceed with authentication or navigation
    Alert.alert("Success!", "Welcome aboard. Let's get started!");
    router.push("/otp");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        className="flex-1 bg-white p-5 justify-between"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View>
          <Text
            className="text-3xl mb-3"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Akwaaba!
          </Text>
          <Text
            className="text-gray-500 text-xs mb-8"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Welcome to Market Mate – your local hub for grocery deals,
            handpicked selections, unbeatable prices, and fast delivery.
          </Text>

          <View className="flex-row items-center border border-gray-200 rounded-2xl w-full mb-2">
            <FloatingLabelInput
              label="Phone Number"
              labelStyles={{
                fontFamily: "Unbounded Light",
                color: "#e5e7eb",
                paddingHorizontal: 3,
                fontSize: 12,
              }}
              leftComponent={
                <View className="flex-row items-center gap-2 border-r border-gray-200 p-2 ml-2">
                  <Image
                    source={require("@/assets/images/ghana-flag.png")}
                    className="w-6 h-6 rounded-lg"
                    resizeMode="contain"
                  />
                  <Text
                    className="text-xs text-gray-500"
                    style={{ fontFamily: "Unbounded Regular" }}
                  >
                    +233
                  </Text>
                </View>
              }
              inputStyles={{
                fontFamily: "Unbounded Regular",
                color: "#4b5563",
                fontSize: 13,
                paddingLeft: 10,
              }}
              customLabelStyles={{ colorFocused: "#9ca3af" }}
              value={phone}
              animationDuration={50}
              hintTextColor={"#9ca3af"}
              mask="123 456 7890"
              hint="123 456 7890"
              maskType="phone"
              keyboardType="numeric"
              onChangeText={setPhone}
              containerStyles={{
                paddingVertical: Platform.OS === "ios" ? 20 : 15,
              }}
              returnKeyType="done"
            />
          </View>

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

        <View className="w-full">
          <Text
            className="text-center text-gray-500 text-xs mb-3"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Or sign in with
          </Text>
          <Pressable
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Google login is on its way. Stay tuned!"
              )
            }
            className="flex-row items-center gap-2 justify-center py-4 rounded-full border border-gray-200"
          >
            <Image
              source={require("@/assets/images/google.png")}
              className="h-6 w-6"
              resizeMode="contain"
            />
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              Continue with Google
            </Text>
          </Pressable>
          <Text
            className="text-xs text-gray-500 mt-4 text-center"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default AuthPage;
