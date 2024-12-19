import { View, Text } from "react-native";
import React from "react";
import { TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";

const SearchComponent = () => {
  return (
    <View className="flex flex-row items-center bg-gray-200 rounded-full px-4 py-2 mb-6 sticky top-1">
      <Feather name="search" size={20} color="gray" className="mr-2" />
      <TextInput
        placeholder="Search MarketMate"
        className="flex-1 bg-transparent outline-none"
        style={{ fontFamily: "Gilroy Medium" }}
      />
    </View>
  );
};

export default SearchComponent;
