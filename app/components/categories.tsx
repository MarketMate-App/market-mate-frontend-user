import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import React from "react";

const CategoriesComponent = () => {
  return (
    <View>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        className="flex-row gap-8 mb-4"
      >
        <View
          className="p-2 items-center bg-gray-50 mr-3 rounded-xl"
          style={style.parent}
        >
          <Image
            source={require("@/assets/images/peach.png")}
            className="h-10 w-10 mb-2"
          />
          <Text
            className="text-center text-gray-400 text-sm"
            style={{ fontFamily: "Gilroy Regular" }}
          >
            Fruits
          </Text>
        </View>
        <View
          className="p-2 items-center bg-gray-50 mr-3 rounded-xl"
          style={style.parent}
        >
          <Image
            source={require("@/assets/images/cabbage.png")}
            className="h-10 w-10 mb-2"
          />
          <Text
            className="text-center text-gray-400 text-sm"
            style={{ fontFamily: "Gilroy Regular" }}
          >
            Vegetables
          </Text>
        </View>
        <View
          className="p-2 items-center bg-gray-50 mr-3 rounded-xl"
          style={style.parent}
        >
          <Image
            source={require("@/assets/images/steak.png")}
            className="h-10 w-10 mb-2"
          />
          <Text
            className="text-center text-gray-400 text-sm"
            style={{ fontFamily: "Gilroy Regular" }}
          >
            Meat
          </Text>
        </View>
        <View
          className="flex-1 p-2 items-center bg-gray-50 mr-3 rounded-xl"
          style={style.parent}
        >
          <Image
            source={require("@/assets/images/fish.png")}
            className="h-10 w-10 mb-2"
          />
          <Text
            className="text-center text-gray-400 text-sm"
            style={{ fontFamily: "Gilroy Regular" }}
          >
            SeaFood
          </Text>
        </View>
        <View
          className="p-2 items-center bg-gray-50 mr-3 rounded-xl"
          style={style.parent}
        >
          <Image
            source={require("@/assets/images/drink.png")}
            className="h-10 w-10 mb-2"
          />
          <Text
            className="text-center text-gray-400 text-sm"
            style={{ fontFamily: "Gilroy Regular" }}
          >
            Dairy
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
const style = StyleSheet.create({
  parent: {
    width: 80,
  },
});
export default CategoriesComponent;
