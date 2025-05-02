import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { FloatingLabelInput } from "react-native-floating-label-input";
import * as SecureStore from "expo-secure-store";

const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [counter, setCounter] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkUserDetails = async () => {
      try {
        const userDetails = await SecureStore.getItemAsync("jwtToken");
        if (userDetails) {
          router.push("/(tabs)/shop");
        }
      } catch (error) {
        // console.error("Error retrieving user details:", error);
      }
    };

    checkUserDetails();
    const fetchPhoneNumber = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem("@phoneNumber");
        if (storedPhoneNumber) {
          setPhoneNumber(
            storedPhoneNumber.replace(
              /^(\d{3})\d{4}(\d{2})$/,
              (_, prefix, suffix) => `${prefix}****${suffix}`
            )
          );
        } else {
          console.warn("No phone number found in storage.");
        }
      } catch (error) {
        console.error("Failed to fetch phone number:", error);
      }
    };
    fetchPhoneNumber();
  }, []);

  useEffect(() => {
    if (resendDisabled && counter > 0) {
      const timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled, counter]);

  const handleContinue = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const storedPhoneNumber = await AsyncStorage.getItem("@phoneNumber");
      if (!storedPhoneNumber) {
        Alert.alert(
          "Missing Information",
          "We couldn't find your phone number. Please try again."
        );
        return;
      }

      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL ||
          "https://marketmate-backend.onrender.com"
        }/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: storedPhoneNumber, otp }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        Alert.alert(
          "Verification Failed",
          errorData?.message || "We couldn't verify your OTP. Please try again."
        );
        return;
      }

      const data = await response.json();
      if (data.success) {
        await saveUserDetails(data.user);
        await saveToken(data.token);
        Alert.alert("Success", "Your OTP has been verified successfully!");
        router.replace("/screens/delivery_address");
      } else {
        Alert.alert(
          "Verification Failed",
          data.message || "The OTP you entered is incorrect."
        );
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert(
        "Unexpected Error",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const saveUserDetails = async (details: any) => {
    try {
      await AsyncStorage.setItem("@userDetails", JSON.stringify(details));
    } catch (error) {
      console.error("Failed to save user details:", error);
      Alert.alert(
        "Storage Error",
        "We couldn't save your user details. Some features may not work."
      );
    }
  };

  const saveToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync("jwtToken", token);
    } catch (error) {
      console.error("Failed to save token:", error);
      Alert.alert(
        "Storage Error",
        "We couldn't save your authentication token. Please log in again."
      );
      throw error;
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const storedPhoneNumber = await AsyncStorage.getItem("@phoneNumber");
      if (!storedPhoneNumber) {
        Alert.alert("Error", "Phone number not found. Please try again.");
        return;
      }

      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL ||
          "https://marketmate-backend.onrender.com"
        }/api/auth/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phoneNumber: storedPhoneNumber }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to send OTP.");
        return;
      }

      Alert.alert("Success", "OTP resent successfully.");
      setResendDisabled(true);
      setCounter(30);
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-white p-5 justify-between"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View>
          <Text
            className="text-3xl mb-3"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Verify Your Identity
          </Text>
          <Text
            className="text-gray-500 mb-8"
            style={{ fontFamily: "WorkSans Medium" }}
          >
            To keep your account secure, please enter the one-time password we
            sent to{" "}
            <Text
              className="text-black text-xs"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              {phoneNumber}
            </Text>
            .
          </Text>

          <View className="flex-row items-center border border-gray-200 rounded-2xl w-full mb-2">
            <FloatingLabelInput
              label="OTP"
              labelStyles={{
                fontFamily: "WorkSans SemiBold",
                color: "#e5e7eb",
                paddingHorizontal: 10,
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
                paddingVertical: 20,
              }}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity
            onPress={handleContinue}
            className="w-full mt-4 bg-[#2BCC5A] py-6 rounded-full border border-white"
            style={{ backgroundColor: "#2BCC5A" }}
          >
            <Text
              className="text-white text-xs text-center"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              Verify OTP
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full">
          <Text
            className="text-center text-gray-500 mb-3"
            style={{ fontFamily: "WorkSans Medium" }}
          >
            Didn't receive OTP?
          </Text>
          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={resendDisabled || loading}
            className="flex-row items-center justify-center py-5 rounded-full border border-gray-200"
            style={{ opacity: resendDisabled || loading ? 0.5 : 1 }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#4b5563" />
            ) : (
              <Text
                className="text-xs text-gray-500"
                style={{ fontFamily: "Unbounded SemiBold" }}
              >
                Resend OTP {resendDisabled && `(${counter})`}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OtpPage;
