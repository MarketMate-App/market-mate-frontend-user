import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import React from "react";

const CategoriesComponent = () => {
  const categories = [
    "fruits",
    "vegetables",
    "meat",
    "fish",
    "dairy",
    "bakery",
    "beverages",
    "snacks",
    "frozen",
    "canned",
    "cleaning",
    "personal care",
    "baby",
    "pets",
  ];
  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="flex-row gap-8 mb-4"
      ></ScrollView>
    </View>
  );
};
const style = StyleSheet.create({
  parent: {
    width: 80,
  },
});
export default CategoriesComponent;
