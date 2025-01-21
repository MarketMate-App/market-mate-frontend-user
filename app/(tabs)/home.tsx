import { View, Text } from "react-native";
import React from "react";
import HeaderComponent from "../components/header";

const HomePage = () => {
  return (
    <View className="flex-1 bg-white p-2">
      <HeaderComponent />
      <Text>HomePage</Text>
    </View>
  );
};

export default HomePage;
