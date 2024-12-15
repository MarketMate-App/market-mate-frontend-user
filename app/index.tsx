import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { ImageBackground, Pressable, Text, View } from "react-native";

export default function Index() {
  return (
    <ImageBackground
      source={require("@/assets/images/woman.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.5)"]}
        className="flex-1 p-8"
      >
        <View className="flex-1">
          <View className="absolute bottom-0 w-full">
            <Text
              className="text-white text-5xl"
              style={{ fontFamily: "Gilroy Medium" }}
            >
              Fast Delivery
            </Text>
            <Text
              className="text-white text-5xl mb-2"
              style={{ fontFamily: "Gilroy Bold" }}
            >
              of fresh groceries
            </Text>
            <Text
              className="text-white text-xl mb-8"
              style={{ fontFamily: "Gilroy Regular" }}
            >
              Order and pickup within 24 hours.
            </Text>
            <Link href={"/auth"} asChild>
              <Pressable className="w-full bg-slate-100 px-8 py-5 rounded-full">
                <Text
                  className="text-center text-xl"
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
  );
}
