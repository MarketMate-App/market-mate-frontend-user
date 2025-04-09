import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  ActivityIndicator,
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

  // Fetch phone number from AsyncStorage
  useEffect(() => {
    const fetchPhoneNumber = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem("@phoneNumber");
        if (storedPhoneNumber) {
          const hiddenNumber = storedPhoneNumber.replace(
            /^(\d{3})\d{4}(\d{2})$/,
            "$1****$2"
          );
          setPhoneNumber(hiddenNumber);
        }
      } catch (error) {
        console.error("Error fetching phone number:", error);
      }
    };
    fetchPhoneNumber();
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && counter > 0) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, counter]);

  const handleContinue = async () => {
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const storedPhoneNumber = await AsyncStorage.getItem("@phoneNumber");
      if (!storedPhoneNumber) {
        throw new Error("Phone number not found. Please try again.");
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: storedPhoneNumber,
            otp,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify OTP");
      }

      const data = await response.json();
      if (data.success) {
        console.log(data);
        const saveUserDetails = async (details: {
          phoneNumber: string;
          fullName: string;
          profilePicture: string;
          address: {
            street: string;
            region: string;
            country: string;
          };
          wishlist: string[];
        }) => {
          try {
            await AsyncStorage.setItem("@userDetails", JSON.stringify(details));
            console.log("User details saved to local storage");
          } catch (error) {
            console.error(
              "Failed to save user details to local storage",
              error
            );
          }
        };
        saveUserDetails(data.user);
        // Save user details to AsyncStorage
        // Save jwt token to secure store
        await SecureStore.setItemAsync("jwtToken", data.token);
        if (await SecureStore.getItemAsync("jwtToken")) {
          console.log("Token saved successfully.");
          Alert.alert("Success", "OTP verified successfully!");
          router.push("/screens/delivery_address");
        }
      } else {
        Alert.alert("Error", data.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  // Alert.alert("Success", "OTP verified successfully!");
  // router.push("/screens/delivery_address");

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const storedPhoneNumber = await AsyncStorage.getItem("@phoneNumber");
      if (!storedPhoneNumber) {
        throw new Error("Phone number not found. Please try again.");
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: storedPhoneNumber,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert(
          "Success",
          "OTP resent successfully. Please check your phone."
        );
        console.log(data);

        setResendDisabled(true);
        setCounter(30);
      } else {
        throw new Error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
            Please enter the one-time password sent to {phoneNumber}.
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
            onPress={handleResendOtp}
            disabled={resendDisabled || loading}
            className="flex-row items-center justify-center py-4 rounded-full border border-gray-200"
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
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default OtpPage;
