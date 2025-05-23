import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter, Stack } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const DeliveryAddressScreen = () => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Western Region");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    const preventBackNavigation = () => {
      router.replace("/profile");
    };

    const handleBeforeRemove = (e: any) => {
      e.preventDefault();
      preventBackNavigation();
    };

    const backHandler = () => {
      preventBackNavigation();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );

    return () => subscription.remove();
  }, [router]);
  const saveDetails = async () => {
    if (!name || !country || !address) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("jwtToken");
      if (!token) {
        setLoading(false);
        Alert.alert("Error", "User is not authenticated");
        return;
      }
      const storedDetails = await AsyncStorage.getItem("@userDetails");
      if (storedDetails) {
        const parsedDetails = JSON.parse(storedDetails);
        const isSameDetails =
          parsedDetails.fullName === name &&
          parsedDetails.address.street === address &&
          parsedDetails.address.region === country;

        if (isSameDetails) {
          setLoading(false);
          Alert.alert("Info", "No changes detected in your details.");
          return;
        }
      }
      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL ||
          "https://marketmate-backend.onrender.com"
        }/api/auth/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: name,
            address: {
              street: address,
              region: country,
            },
          }),
        }
      );

      if (!response.ok) {
        setLoading(false);
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Failed to save details");
        return;
      }

      const responseData = await response.json();
      if (responseData.success) {
        console.log(responseData);

        await saveUserDetails(responseData.user);
        Alert.alert("Success", "Your details have been saved successfully!");
        router.replace("/profile");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to save details. Please try again.");
    }
  };
  const saveUserDetails = async (details: any) => {
    if (!name || !country || !address) {
      Alert.alert("Error", "Please fill in all fields. ");
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.setItem("@userDetails", JSON.stringify(details));
      console.log("User details saved to local storage");
    } catch (error) {
      console.error("Failed to save user details to local storage", error);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await AsyncStorage.getItem("@userDetails");
        console.log(details);
        if (details) {
          await AsyncStorage.removeItem("products");
          console.log(await AsyncStorage.getAllKeys());

          const { fullName, address } = JSON.parse(details);
          setName(fullName);
          setCountry(address.region);
          setAddress(address.street);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <ScrollView className="flex-1 bg-white p-3">
            <Stack.Screen
              options={{
                headerTitleAlign: "center",
                title: "",
                headerShadowVisible: false,
                headerTitleStyle: {
                  fontFamily: "Unbounded Regular",
                  fontSize: 14,
                },
              }}
            />
            <Text
              className="text-3xl mb-3"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Tell us about yourself.
            </Text>
            <Text
              className="text-gray-500 mb-8"
              style={{ fontFamily: "WorkSans Medium" }}
            >
              We prioritize your privacy. Your details are encrypted and handled
              with the utmost care to ensure your security.
            </Text>
            <KeyboardAvoidingView className="bg-white border-hairline items-center gap-2 border-gray-200 mb-4 rounded-xl">
              <FloatingLabelInput
                label="Full name"
                labelStyles={{
                  fontFamily: "WorkSans SemiBold",
                  color: "#e5e7eb",
                  paddingHorizontal: 3,
                  fontSize: 12,
                }}
                inputStyles={{
                  fontFamily: "Unbounded Regular",
                  color: "#4b5563",
                  fontSize: 13,
                }}
                customLabelStyles={{
                  colorFocused: "#9ca3af",
                  topFocused: -18,
                  leftFocused: Platform.OS === "ios" ? 20 : 10,
                }}
                value={name}
                hint="ex: Kwame Nkrumah"
                hintTextColor="#9ca3af"
                animationDuration={50}
                onChangeText={(value) => setName(value)}
                containerStyles={{
                  paddingVertical: 20,
                  paddingLeft: 10,
                  borderWidth: 0,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#e5e7eb",
                }}
                ref={nameRef}
                returnKeyType="next"
                onSubmitEditing={() => countryRef.current?.focus()}
              />
              <FloatingLabelInput
                label="Region"
                labelStyles={{
                  fontFamily: "WorkSans SemiBold",
                  color: "#e5e7eb",
                  paddingHorizontal: 3,
                  fontSize: 12,
                }}
                inputStyles={{
                  fontFamily: "Unbounded Regular",
                  color: "#4b5563",
                  fontSize: 13,
                }}
                customLabelStyles={{ colorFocused: "#9ca3af" }}
                value={country}
                hint="ex: Western Region"
                defaultValue="Western Region"
                hintTextColor="#9ca3af"
                onChangeText={(value) => setCountry(value)}
                containerStyles={{
                  paddingVertical: 20,
                  paddingLeft: 10,
                  borderWidth: 0,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#e5e7eb",
                }}
                ref={countryRef}
                returnKeyType="next"
                onSubmitEditing={() => addressRef.current?.focus()}
              />
              <FloatingLabelInput
                label="Street Address"
                animationDuration={50}
                labelStyles={{
                  fontFamily: "WorkSans SemiBold",
                  color: "#e5e7eb",
                  paddingHorizontal: 3,
                  fontSize: 12,
                }}
                inputStyles={{
                  fontFamily: "Unbounded Regular",
                  color: "#4b5563",
                  fontSize: 13,
                }}
                customLabelStyles={{ colorFocused: "#9ca3af" }}
                value={address}
                hint="ex:Justmoh Avenue"
                hintTextColor="#9ca3af"
                onChangeText={(value) => setAddress(value)}
                containerStyles={{
                  paddingVertical: 20,
                  paddingLeft: 10,
                  borderWidth: 0,
                  borderBottomWidth: 0.5,
                  borderBottomColor: "#e5e7eb",
                }}
                ref={addressRef}
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
              />

              {/* <View className="flex-row flex-1 items-center ">
                <FloatingLabelInput
                  label="Phone"
                  labelStyles={{
                    fontFamily: "WorkSans SemiBold",
                    color: "#e5e7eb",
                    paddingHorizontal: 3,
                    fontSize: 12,
                  }}
                  leftComponent={
                    <View className="flex-row items-center gap-2 border-hairline border-gray-200 p-2 rounded-xl absolute left-3">
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
                  }}
                  customLabelStyles={{ colorFocused: "#9ca3af" }}
                  value={phone}
                  animationDuration={50}
                  hintTextColor={"#9ca3af"}
                  mask="123 456 7890"
                  hint="123 456 7890"
                  maskType="phone"
                  keyboardType="numeric"
                  onChangeText={(value) => setPhone(value)}
                  containerStyles={{
                    paddingLeft: 100,
                    paddingTop: Platform.OS === "ios" ? 20 : 15,
                    paddingBottom: Platform.OS === "ios" ? 20 : 15,
                    borderWidth: 0,
                    borderBottomWidth: 0,
                    borderBottomColor: "#e5e7eb",
                  }}
                  ref={phoneRef}
                  returnKeyType="done"
                />
              </View> */}
            </KeyboardAvoidingView>
          </ScrollView>

          <View
            style={{ paddingBottom: Platform.OS === "ios" ? 20 : 12 }}
            className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-0 left-0 right-0"
          >
            <Pressable
              className="bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white"
              onPress={saveDetails}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text
                  className="text-white text-xs text-center"
                  style={{ fontFamily: "Unbounded SemiBold" }}
                >
                  Save my information
                </Text>
              )}
            </Pressable>
          </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default DeliveryAddressScreen;
