import { router } from "expo-router";
import React from "react";
import { View, Pressable, Text } from "react-native";

// components/GuestBanner.js
export default function GuestBanner() {
  return (
    <View className="bg-[#2BCC5A]/10 p-3 rounded-2xl border border-[#2BCC5A]">
      <Text
        className="text-[#2BCC5A] text-sm"
        style={{ fontFamily: "Unbounded Regular" }}
      >
        Sign up with your phone number to:
      </Text>
      <View className="mt-1">
        <Text className="text-xs" style={{ fontFamily: "Unbounded Regular" }}>
          ✓ Save your cart
        </Text>
        <Text className="text-xs" style={{ fontFamily: "Unbounded Regular" }}>
          ✓ Track orders
        </Text>
        <Text className="text-xs" style={{ fontFamily: "Unbounded Regular" }}>
          ✓ Earn rewards
        </Text>
      </View>
      <Pressable
        className="bg-[#2BCC5A] py-2 px-4 rounded-full mt-2 self-start"
        onPress={() => router.push("/auth")}
      >
        <Text
          className="text-white text-xs"
          style={{ fontFamily: "Unbounded Medium" }}
        >
          Continue with Phone Number
        </Text>
      </Pressable>
    </View>
  );
}
