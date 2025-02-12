import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import { router } from "expo-router";
import React from "react";

const PhoneAuthScreen = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeStep, setActiveStep] = useState("phone");
  const [resendTime, setResendTime] = useState(59);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  const slideAnim = useRef(new Animated.Value(0)).current;
  const otpInputs = useRef<(TextInput | null)[]>([]);

  // Ghanaian phone validation: 0[235] followed by 8 digits
  const validatePhone = (number: string) => {
    const isValid = Number(number);
    setPhoneError(
      isValid ? "" : "Please enter a valid Ghanaian number (e.g., 055 123 4567)"
    );
    return isValid;
  };

  const animateStep = (toValue: number) => {
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeStep === "otp" && resendTime > 0) {
      timer = setInterval(() => setResendTime((t) => t - 1), 1000);
    }
    return () => timer && clearInterval(timer);
  }, [activeStep, resendTime]);

  const handlePhoneSubmit = async () => {
    if (!validatePhone(phone)) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    animateStep(1);
    setActiveStep("otp");
    setResendTime(59);
  };

  const handleOtpSubmit = () => {
    router.push("/home");
  };

  return (
    <View className="flex-1 bg-white px-4 pt-8">
      {/* Persuasive Copy Section */}
      <View className="mb-8">
        <Text className="text-2xl font-unbounded-bold text-gray-900 mb-2">
          {activeStep === "phone"
            ? "Get Market-Fresh Food in 90 Minutes 🥑"
            : "Secure Access to Your Fresh Groceries 🔒"}
        </Text>
        <Text className="text-gray-600 font-unbounded-regular">
          {activeStep === "phone"
            ? "Join thousands of smart Accra homes enjoying hassle-free essentials delivery"
            : `Security code sent to +233${phone.slice(0, 3)}****${phone.slice(
                -3
              )} - We protect your data like our own`}
        </Text>
      </View>

      {/* Form Container */}
      <View className="flex-1">
        {/* Phone Input */}
        <Animated.View
          style={{
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -100],
                }),
              },
            ],
            opacity: slideAnim.interpolate({
              inputRange: [0, 0.5],
              outputRange: [1, 0],
            }),
          }}
        >
          <Pressable className="border border-gray-200 rounded-xl h-14 px-4 justify-center">
            <View className="flex-row items-center">
              <Text className="text-gray-500 font-unbounded-medium mr-2">
                +233
              </Text>
              <TextInput
                id="phoneInput"
                className="flex-1 font-unbounded-regular text-gray-900 text-lg"
                placeholder="55 123 4567"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(v) => {
                  setPhone(v.replace(/[^0-9]/g, ""));
                  setPhoneError("");
                }}
                onBlur={() => validatePhone(phone)}
                maxLength={9}
                accessibilityLabel="Enter your Ghanaian phone number"
              />
            </View>
          </Pressable>
          {phoneError && (
            <Text className="text-red-500 font-unbounded-regular mt-2 text-sm">
              {phoneError}
            </Text>
          )}
        </Animated.View>

        {/* OTP Inputs */}
        <Animated.View
          style={{
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [100, 0],
                }),
              },
            ],
            opacity: slideAnim,
          }}
          className="absolute top-0 left-0 right-0"
        >
          <View className="flex-row justify-between mb-4">
            {otp.map((_, index) => (
              <Pressable
                key={index}
                className="w-12 h-12 justify-center"
                onPress={() => otpInputs.current[index]?.focus()}
              >
                <TextInput
                  ref={(ref) => (otpInputs.current[index] = ref)}
                  className="w-full h-full border border-gray-200 rounded-xl text-center font-unbounded-medium text-xl"
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[index]}
                  onChangeText={(v) => handleOtpChange(v, index)}
                  accessibilityLabel={`OTP digit ${index + 1}`}
                />
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={() => {
              animateStep(0);
              setActiveStep("phone");
            }}
            className="self-center"
          >
            <Text className="text-[#2BCC5A] font-unbounded-medium">
              ← Different number? Click here
            </Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Fixed Bottom CTA */}
      <View className="pb-4 bg-white border-t border-gray-100 pt-4">
        {activeStep === "phone" ? (
          <Pressable
            onPress={handlePhoneSubmit}
            className={`h-14 rounded-xl justify-center ${
              phone.length === 9 ? "bg-[#2BCC5A]" : "bg-gray-200"
            }`}
            disabled={phone.length !== 9 || isLoading}
          >
            <Text className="text-center font-unbounded-semibold text-white">
              {isLoading ? "Securely connecting..." : "Continue with Phone →"}
            </Text>
          </Pressable>
        ) : (
          <View className="space-y-2">
            <Text className="text-center text-gray-600 font-unbounded-regular">
              No code?{" "}
              <Pressable
                onPress={() => resendTime === 0 && setResendTime(59)}
                disabled={resendTime > 0}
              >
                <Text
                  className={`font-unbounded-medium ${
                    resendTime > 0 ? "text-gray-400" : "text-[#2BCC5A]"
                  }`}
                >
                  {resendTime > 0
                    ? `Resend SMS in ${resendTime}s`
                    : "Send code again"}
                </Text>
              </Pressable>
            </Text>

            <Pressable
              onPress={handleOtpSubmit}
              className={`h-14 rounded-xl justify-center ${
                otp.join("").length === 6 ? "bg-[#2BCC5A]" : "bg-gray-200"
              }`}
              disabled={otp.join("").length !== 6}
            >
              <Text className="text-center font-unbounded-semibold text-white">
                Verify & Start Shopping →
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default PhoneAuthScreen;
