import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useRef } from "react";
import { router, Stack } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";

const CheckoutScreen = () => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const countryRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const handleProceedToPayment = () => {
    if (!name || !country || !address || !phone) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/screens/payment");
    }, 1000);
  };

  return (
    <>
      <ScrollView className="flex-1 bg-white px-3">
        <Stack.Screen
          options={{
            headerTitleAlign: "center",
            title: "Checkout",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Unbounded Regular", fontSize: 14 },
          }}
        />
        <Text
          className="text-xs text-gray-500 mb-2"
          style={{ fontFamily: "Unbounded Regular" }}
        >
          Delivery Address
        </Text>

        <View className="bg-white border-hairline items-center gap-2 border-gray-200 mb-4 rounded-xl">
          <FloatingLabelInput
            label="Full name"
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
            }}
            customLabelStyles={{ colorFocused: "#9ca3af" }}
            value={name}
            hint="ex: Kwame Nkrumah"
            hintTextColor="#9ca3af"
            animationDuration={50}
            onChangeText={(value) => setName(value)}
            containerStyles={{
              paddingLeft: Platform.OS === "ios" ? 20 : 10,
              paddingTop: Platform.OS === "ios" ? 20 : 15,
              paddingBottom: Platform.OS === "ios" ? 20 : 15,
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
              fontFamily: "Unbounded Light",
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
            hintTextColor="#9ca3af"
            onChangeText={(value) => setCountry(value)}
            containerStyles={{
              paddingLeft: Platform.OS === "ios" ? 20 : 10,
              paddingTop: Platform.OS === "ios" ? 20 : 15,
              paddingBottom: Platform.OS === "ios" ? 20 : 15,
              borderWidth: 0,
              borderBottomWidth: 0.5,
              borderBottomColor: "#e5e7eb",
            }}
            ref={countryRef}
            returnKeyType="next"
            onSubmitEditing={() => addressRef.current?.focus()}
          />
          <FloatingLabelInput
            label="Address"
            animationDuration={50}
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
            }}
            customLabelStyles={{ colorFocused: "#9ca3af" }}
            value={address}
            hint="ex:Justmoh Avenue"
            hintTextColor="#9ca3af"
            onChangeText={(value) => setAddress(value)}
            containerStyles={{
              paddingLeft: Platform.OS === "ios" ? 20 : 10,
              paddingTop: Platform.OS === "ios" ? 20 : 15,
              paddingBottom: Platform.OS === "ios" ? 20 : 15,
              borderWidth: 0,
              borderBottomWidth: 0.5,
              borderBottomColor: "#e5e7eb",
            }}
            ref={addressRef}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          <View className="flex-row flex-1 items-center ">
            <FloatingLabelInput
              label="Phone"
              labelStyles={{
                fontFamily: "Unbounded Light",
                color: "#e5e7eb",
                paddingHorizontal: 3,
                fontSize: 12,
              }}
              maxLength={10}
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
              mask="123 456 789"
              hint="123 456 789"
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
          </View>
        </View>
        <Text
          className="text-xs text-gray-500 mt-2 mb-2"
          style={{ fontFamily: "Unbounded Regular" }}
        >
          Have Coupon?
        </Text>
        <View className="bg-white p-3 border-hairline flex-row items-center gap-2 border-gray-200 mb-4 rounded-xl">
          <MaterialIcons name="local-offer" size={24} color="grey" />
          <View>
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Enter Coupon Code
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="grey"
            style={{ position: "absolute", right: 5 }}
          />
        </View>
      </ScrollView>
      <View
        style={{ paddingBottom: Platform.OS === "ios" ? 20 : 12 }}
        className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-0 left-0 right-0"
      >
        <Pressable
          className="bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white"
          onPress={handleProceedToPayment}
          disabled={loading}
        >
          <Text
            className="text-white text-xs text-center"
            style={{ fontFamily: "Unbounded SemiBold" }}
          >
            {loading ? "Processing..." : "Proceed to Payment"}
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default CheckoutScreen;
