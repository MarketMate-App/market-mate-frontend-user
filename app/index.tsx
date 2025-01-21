import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
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
        source={{
          uri: "https://images.pexels.com/photos/12024075/pexels-photo-12024075.jpeg?auto=compress&cs=tinysrgb&w=600",
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)"]}
          className="flex-1 p-3"
        >
          <View className="flex-1">
            <View className="absolute bottom-0 w-full">
              <Text
                className="text-white text-5xl mb-1"
                style={{ fontFamily: "Unbounded Regular" }}
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
                className="text-gray-100 text-lg mb-8"
                style={{ fontFamily: "Unbounded Light" }}
              >
                Order and pickup within 24 hours.
              </Text>
              <Pressable
                onPress={() => router.push("/shop")}
                className="w-full bg-[#2BCC5A] px-8 py-5 rounded-full"
              >
                <Text
                  className="text-center text-sm text-white"
                  style={{ fontFamily: "Unbounded SemiBold" }}
                >
                  Get Started
                </Text>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}
