import { View, Text } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";

const HeaderComponent = () => {
  return (
    <View className="flex-row items-center justify-between w-full mb-4">
      <View>
        <Text
          style={{ fontFamily: "Gilroy Regular" }}
          className="text-gray-500"
        >
          Deliver now
        </Text>
        <Text className="text-lg" style={{ fontFamily: "Gilroy Bold" }}>
          Justmoh Avenue
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Link href={"/screens/search"}>
          <View className="py-3 px-5 rounded-full bg-gray-50">
            <Feather name="search" size={20} color="gray" />
          </View>
        </Link>
        <Link href={"/screens/cart"}>
          <View className="bg-black py-2 px-4 rounded-full flex-row items-center justify-center gap-3">
            <Feather name="shopping-bag" size={24} color="white" />
            <Text
              className="text-white text-xl"
              style={{ fontFamily: "Gilroy Bold" }}
            >
              0
            </Text>
          </View>
        </Link>
      </View>
    </View>
  );
};

export default HeaderComponent;
