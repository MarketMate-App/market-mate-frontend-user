import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, Text, View } from "react-native";

export default function Index() {
  return (
    <ImageBackground
      source={require("@/assets/images/woman.png")}
      style={{ width: "100%", height: "100%" }}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.5)", "transparent"]}
        style={{ flex: 1 }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 32,
              fontFamily: "Plus Jakarta Sans Bold",
            }}
          >
            Welcome to Expo Router
          </Text>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
