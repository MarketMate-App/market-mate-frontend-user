import { View, Text, SafeAreaView, Platform } from "react-native";
import React from "react";
import HeaderComponent from "../components/header";
import { useHeaderHeight } from "@react-navigation/elements";

const HomePage = () => {
  const headerHeight = useHeaderHeight();
  console.log(headerHeight);

  return (
    <View
      style={{ paddingTop: Platform.OS === "ios" ? 50 : 0 }}
      className="flex-1 bg-white p-3"
    >
      <HeaderComponent />
      <Text>HomePage</Text>
    </View>
  );
};

export default HomePage;
