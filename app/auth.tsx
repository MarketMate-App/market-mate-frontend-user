import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  BackHandler,
  TouchableOpacity,
} from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import * as SecureStore from "expo-secure-store";
const AuthPage = () => {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const clearStorage = async () => {
    try {
      await AsyncStorage.multiRemove(["@phoneNumber", "@userDetails"]);
      await SecureStore.deleteItemAsync("jwtToken");
      // console.log("All data cleared from local storage and async storage.");
    } catch (error) {
      // console.error("Error clearing storage:", error);
    }
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const cleanedPhone = phoneNumber.replace(/\s/g, "");
    const ghanaianPhoneRegex = /^\d{9}$/;
    return ghanaianPhoneRegex.test(cleanedPhone);
  };

  const handleContinue = async () => {
    if (!phone) {
      Alert.alert("Error", "Phone number cannot be empty.");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid Ghanaian phone number (9 digits)."
      );
      return;
    }

    const formattedPhone = phone.replace(/\s/g, "");
    const formattedPhoneNumber = `+233${formattedPhone}`;
    // console.log(formattedPhoneNumber);

    // Save number to AsyncStorage

    try {
      await AsyncStorage.setItem("@phoneNumber", formattedPhoneNumber);
      // console.log("Phone number saved successfully.");
    } catch (error) {
      // console.error("Error saving phone number:", error);
    }

    setLoading(true); // Start loading
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: formattedPhoneNumber,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }

      const data = await response.json();
      if (data.success) {
        // console.log("OTP sent successfully:", data);
        Alert.alert(
          "Success",
          "OTP sent successfully. Please check your phone."
        );
        router.push("/otp");
      } else {
        Alert.alert("Error", data.message || "Failed to send OTP");
      }
    } catch (error) {
      // console.error("Error sending OTP:", error);
      Alert.alert(
        "Error",
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    const backAction = () => {
      router.push("/home");
      return true; // Prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Cleanup on unmount
  }, []);
  useEffect(() => {
    const initialize = async () => {
      await clearStorage();
    };
    initialize();
  }, []);

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

          <TouchableOpacity
            onPress={handleContinue}
            className="w-full mt-4 bg-[#2BCC5A] py-5 rounded-full border border-white"
            style={{ backgroundColor: "#2BCC5A" }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                className="text-white text-xs text-center"
                style={{ fontFamily: "Unbounded SemiBold" }}
              >
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="w-full">
          {/* <Text
            className="text-center text-gray-500 text-xs mb-3"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Or sign in with
          </Text>
          <TouchableOpacity
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
          </TouchableOpacity> */}
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
