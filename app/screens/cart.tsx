import { View, Text, Pressable } from "react-native";
import React from "react";

const CartScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white p-3">
      <Text>CartScreen</Text>
      <Pressable
        className="bg-[green] px-8 py-5 rounded-full w-full"
        onPress={() => alert("Checkout")}
      >
        <Text
          className="text-white text-center text-lg"
          style={{ fontFamily: "Gilroy Bold" }}
        >
          Checkout
        </Text>
      </Pressable>
    </View>
  );
};

export default CartScreen;
