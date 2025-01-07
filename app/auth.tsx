import { View, Text, Image, ImageBackground, Pressable } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";

export default function Authentication() {
  return (
    <SafeAreaView className="bg-white flex-1 ">
      <ImageBackground
        source={require("@/assets/images/splash.png")}
        className="flex-1"
      >
        <LinearGradient
          colors={["rgba(255,255,255,0.96)", "rgba(255,255,255,1)"]}
          className="flex-1 items-center justify-center"
        >
          <Image
            source={require("@/assets/images/logo.png")}
            className="w-20 h-20 mb-8"
          />
          <Text
            className="text-4xl text-slate-900 mb-2"
            style={{ fontFamily: "Unbounded SemiBold" }}
          >
            Welcome to Marketmate
          </Text>
          <Text
            className="text-lg text-slate-600 mb-20"
            style={{ fontFamily: "Gilroy Regular" }}
          >
            Everyday essentials delivered to your doorstep.
          </Text>
          <View className="w-full px-4">
            <Link href={"/registration"} asChild>
              <Pressable className="w-92 m-auto bg-[#2bcc5a] px-8 py-5 rounded-[16px] mb-4">
                <Text
                  className="text-center text-xl text-white"
                  style={{ fontFamily: "Gilroy Bold" }}
                >
                  Create an Account
                </Text>
              </Pressable>
            </Link>
            <Link href={"/login"} asChild>
              <Pressable className="w-full bg-transparent px-8 py-5 rounded-[16px] ">
                <Text
                  className="text-center text-lg"
                  style={{ fontFamily: "Gilroy Bold" }}
                >
                  Log in
                </Text>
              </Pressable>
            </Link>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}
