import { View, Text } from "react-native";
import React from "react";
import Ico from "../../assets/icons/cart.svg";

const Cart = () => {
  return (
    <View className=" flex-1 items-center justify-center ">
      <Text>Cart</Text>
      <Ico className="w-6 h-6" fill="red" />
    </View>
  );
};

export default Cart;
