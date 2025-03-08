import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { useFonts } from "expo-font";
import {
  ImageBackground,
  Pressable,
  Text,
  View,
  SafeAreaView,
} from "react-native";

export default function Index() {
  const [fontsLoaded] = useFonts({
    "Unbounded Regular": require("../assets/fonts/Unbounded-Regular.ttf"),
    "Unbounded SemiBold": require("../assets/fonts/Unbounded-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      {/* <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      /> */}
      <ImageBackground
        source={{
          uri: "https://images.pexels.com/photos/27950727/pexels-photo-27950727/free-photo-of-a-woman-standing-in-front-of-a-market-with-fresh-produce.jpeg?auto=compress&cs=tinysrgb&w=600",
        }}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          className="flex-1 p-5"
        >
          <View className="flex-1 justify-end">
            <Text
              className="text-4xl mb-2"
              style={{ fontFamily: "Unbounded Regular", color: "#fff" }}
            >
              Welcome to Market Mate
            </Text>
            <Text
              className="text-gray-400 text-sm mb-10"
              style={{ fontFamily: "Unbounded Regular", lineHeight: 22 }}
            >
              Discover unbeatable deals on fresh produce and everyday
              essentials. Enjoy a seamless shopping experience tailored for you.
            </Text>
            <Pressable
              onPress={() => router.push("/shop")}
              accessibilityLabel="Start shopping now"
              className="w-full bg-[#2BCC5A] px-8 py-5 rounded-full"
            >
              <Text
                className="text-center text-xs text-white"
                style={{ fontFamily: "Unbounded SemiBold" }}
              >
                Shop Now & Save
              </Text>
            </Pressable>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}
