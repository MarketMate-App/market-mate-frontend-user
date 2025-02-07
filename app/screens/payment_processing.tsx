import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  Alert,
  BackHandler,
} from "react-native";
import LottieView from "lottie-react-native";
import { router, Stack, useFocusEffect } from "expo-router";

const PaymentProcessingScreen = () => {
  const [status, setStatus] = useState("processing");
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleBackPress = () => {
    router.push("/(tabs)/shop");
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setStatus("success"));
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <View className="flex-1 bg-white p-5 items-center justify-center">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        {status === "processing" ? (
          <Animated.View
            className="items-center mt-10 z-40"
            style={{ opacity: fadeAnim }}
          >
            <LottieView
              style={{ width: 100, height: 100 }}
              autoPlay
              loop={true}
              source={require("@/assets/animations/bounce.json")}
            />
            {/* <ActivityIndicator size="large" color="#4CAF50" /> */}
            <Text
              className="text-lg text-gray-700 mb-4"
              style={{ fontFamily: "Unbounded Medium" }}
            >
              Processing Payment
            </Text>
            <Text
              className="text-center w-80 text-gray-500 mb-8 text-xs"
              style={{ fontFamily: "Unbounded Light" }}
            >
              Please wait while we verify your details. This usually takes 30
              seconds.
            </Text>
          </Animated.View>
        ) : (
          <View className="items-center">
            <LottieView
              style={{ width: 400, height: 400 }}
              autoPlay
              loop={false}
              source={require("@/assets/animations/basket.json")}
            />
            <Text
              className=" text-[#2BCC5A]"
              style={{ fontFamily: "Unbounded Medium" }}
            >
              Order Confirmed!
            </Text>
            <Text className="text-base text-gray-600 font-unbounded-regular text-center">
              Your order has been confirmed. You'll receive an email receipt
              shortly.
            </Text>
          </View>
        )}
      </View>
      <View
        style={{ paddingBottom: Platform.OS === "ios" ? 20 : 12 }}
        className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-0 left-0 right-0"
      >
        <Pressable
          className="bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white"
          onPress={() => router.push("/screens/payment_processing")}
          disabled={status === "processing"}
        >
          {status === "processing" ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text
              className="text-white text-xs text-center"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              Continue
            </Text>
          )}
        </Pressable>
      </View>
    </>
  );
};

export default PaymentProcessingScreen;
