import { router } from "expo-router";
import React from "react";
import { View, Pressable, Text } from "react-native";

export default function GuestBanner() {
  return (
    <View className="bg-[#2BCC5A]/5 px-3 py-2 rounded-lg border border-[#2BCC5A]/20 mb-4">
      <View className="flex-row flex-wrap items-center justify-between">
        <Text
          className="text-[#2BCC5A]/90 text-xs mr-2 mb-3"
          style={{ fontFamily: "WorkSans SemiBold" }}
        >
          Use your phone number to unlock exclusive deals, save your cart, and
          track every order with ease. It's fast, secure, and tailored just for
          you!
        </Text>
        <Pressable
          onPress={() => router.push("/auth")}
          className="border-b border-[#2BCC5A] pb-0.5 active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Join now"
          accessibilityHint="Navigates to the sign-up page"
        >
          <Text
            className="text-[#2BCC5A] text-xs"
            style={{ fontFamily: "WorkSans Bold" }}
          >
            Join now!
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
