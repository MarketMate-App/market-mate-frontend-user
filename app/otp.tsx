import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";

const OtpPage = () => {
  const [otp, setOtp] = useState("");

  const handleContinue = () => {
    // Validate that the OTP contains exactly 6 digits
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }
    // Proceed with OTP verification or navigation
    Alert.alert("Success", "OTP verified successfully!");
    router.push("/screens/delivery_address");
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
            presentation: "modal",
          }}
        />
        <View>
          <Text
            className="text-3xl mb-3"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Enter OTP
          </Text>
          <Text
            className="text-gray-500 text-xs mb-8"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Please enter the one-time password sent to +233******209.
          </Text>

          <View className="flex-row items-center border border-gray-200 rounded-2xl w-full mb-2">
            <FloatingLabelInput
              label="OTP"
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
              value={otp}
              animationDuration={50}
              hintTextColor={"#9ca3af"}
              mask="123456"
              hint="123456"
              keyboardType="numeric"
              onChangeText={setOtp}
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
              Verify
            </Text>
          </Pressable>
        </View>

        <View className="w-full">
          <Text
            className="text-center text-gray-500 text-xs mb-3"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Didn't receive your OTP?
          </Text>
          <Pressable
            onPress={() =>
              Alert.alert("Resend OTP", "OTP has been resent to your device.")
            }
            className="flex-row items-center justify-center py-4 rounded-full border border-gray-200"
          >
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              Resend OTP
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OtpPage;
