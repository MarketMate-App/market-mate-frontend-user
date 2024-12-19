import { View, Text } from "react-native";
import React from "react";
import SearchComponent from "../components/search";
import CategoriesComponent from "../components/categories";

const SearchScreen = () => {
  return (
    <View className="bg-white flex-1 px-3">
      <SearchComponent />
      <CategoriesComponent />
    </View>
  );
};

export default SearchScreen;
