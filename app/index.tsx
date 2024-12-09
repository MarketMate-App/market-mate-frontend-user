import { View, Text, Pressable } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginPage = () => {
  const router = useRouter();
  const handlePress = () => {
    router.replace("/(tabs)/home");
  };
  return (
    <SafeAreaView className="flex-1 flex-col items-center justify-center p-2">
      <Pressable onPress={handlePress}>
        <Text>Go to home</Text>
      </Pressable>
      <Link href={"/register"} asChild>
        <Pressable className=" w-full h-16 bg-[#61ad4e] text-white items-center justify-center rounded-full absolute bottom-0">
          <Text className="text-[#f9f9f9] font-bold text-base">
            Create Account
          </Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
};

export default LoginPage;
