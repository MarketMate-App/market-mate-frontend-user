import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  ImageBackground,
  Pressable,
  Text,
  View,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default function Index() {
  return (
    <SafeAreaView>
      <ImageBackground
        source={require("@/assets/images/woman.png")}
        style={{ width: "100%", height: "100%" }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)"]}
          className="flex-1 p-3"
        >
          <View className="flex-1">
            <View className="absolute bottom-0 w-full">
              <Text
                className="text-white text-5xl"
                style={{ fontFamily: "Unbounded Light" }}
              >
                Fast Delivery
              </Text>
              <Text
                className="text-white text-5xl mb-2"
                style={{ fontFamily: "Unbounded SemiBold" }}
              >
                of fresh groceries
              </Text>
              <Text
                className="text-gray-100 text-xl mb-8"
                style={{ fontFamily: "Gilroy Regular" }}
              >
                Order and pickup within 24 hours.
              </Text>
              <Link href={"/home"} asChild>
                <Pressable className="w-full bg-[#2BCC5A] px-8 py-5 rounded-[16px]">
                  <Text
                    className="text-center text-xl text-white"
                    style={{ fontFamily: "Gilroy Bold" }}
                  >
                    Get Started
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}
