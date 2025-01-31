import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useState } from "react";
import { router, Stack } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";

const CheckoutScreen = () => {
  const [cont, setCont] = useState("");
  const [show, setShow] = useState(false);

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
          className="text-xs text-gray-500 mt-2"
          style={{ fontFamily: "Unbounded Regular" }}
        >
          Delivery Address
        </Text>

        <View className="bg-white p-3 border-hairline flex-row items-center gap-2 border-gray-200 mb-4 rounded-xl">
          <FloatingLabelInput label="Full name" />
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
      <View className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-0 left-0 right-0">
        <Pressable
          className="bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white"
          onPress={() => router.push("/screens/payment")}
        >
          <Text
            className="text-white text-xs text-center"
            style={{ fontFamily: "Unbounded SemiBold" }}
          >
            Proceed to Payment
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default CheckoutScreen;
