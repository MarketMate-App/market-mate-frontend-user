// CartComponent.tsx
import React, { useState } from "react";
import { View, Text, Button, ScrollView, Pressable, Image } from "react-native";
import { useCartStore } from "../store/cartStore";
import { router } from "expo-router";
import { Entypo } from "@expo/vector-icons";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  unitOfMeasure: string;
};

type CartState = {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};

const CartComponent = () => {
  const [quantity, setQuantity] = useState(1);
  const cart = useCartStore((state) => (state as CartState).cart);
  const removeFromCart = useCartStore(
    (state) => (state as CartState).removeFromCart
  );
  const clearCart = useCartStore((state) => (state as CartState).clearCart);

  const handleQuantityChange = (item: CartItem, increment: boolean) => {
    if (increment) {
      item.quantity += 1;
    } else {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        removeFromCart(item.id);
      }
    }
    setQuantity(item.quantity);
  };

  const calculateTotal = () => {
    return cart
      .reduce((acc, item) => acc + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <>
      <ScrollView className="bg-white flex-1 px-3 mb-20">
        {cart.length > 0 && (
          <>
            <View className="mb-2 bg-white flex-row items-center justify-between sticky top-0 left-0 right-0">
              <Text
                className="text-xs text-gray-500"
                style={{ fontFamily: "Unbounded Regular" }}
              >
                Estimated:{" "}
                <Text className="text-gray-700">₵{calculateTotal()}</Text>
              </Text>
              <Text
                className="text-xs text-gray-500"
                style={{ fontFamily: "Unbounded Light" }}
              >
                {cart.length} items
              </Text>
            </View>
            <View className="flex-row justify-end">
              <Pressable
                className="px-4 py-2 bg-red-500 rounded-full flex-row items-center justify-center"
                onPress={clearCart}
              >
                <Entypo
                  name="trash"
                  size={16}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text
                  className="text-white text-xs text-center"
                  style={{ fontFamily: "Unbounded SemiBold" }}
                >
                  Remove all items
                </Text>
              </Pressable>
            </View>
          </>
        )}
        {cart.map((item) => (
          <View key={item.id} className="flex-row items-center justify-between">
            <View className="flex-row items-center justify-center gap-4">
              <Image
                source={{ uri: item.imageUrl }}
                className="w-24 h-24"
                resizeMode="contain"
              />
              <View>
                <Text
                  className="text-sm text-gray-700 mb-2"
                  style={{ fontFamily: "Unbounded Medium" }}
                >
                  {item.name}
                </Text>
                <Text
                  className="text-gray-500 text-xs mb-4"
                  style={{ fontFamily: "Unbounded Light" }}
                >
                  1 {item.unitOfMeasure}
                </Text>
              </View>
            </View>
            <View className="items-center justify-between">
              <Text
                className="text-sm relative mb-2 text-gray-700"
                style={{ fontFamily: "Unbounded Regular" }}
              >
                ₵{Math.floor(item.price)}.{item.price.toFixed(2).split(".")[1]}
              </Text>
              <View className="flex-row items-center gap-2">
                <Entypo
                  name="minus"
                  size={20}
                  color={"gray"}
                  className="border-hairline border-gray-300 rounded-full p-1"
                  onPress={() => handleQuantityChange(item, false)}
                />
                <Text
                  className="mx-2 text-gray-500 text-sm"
                  style={{ fontFamily: "Unbounded Regular" }}
                >
                  {item.quantity}
                </Text>
                <Entypo
                  name="plus"
                  size={20}
                  color={"white"}
                  onPress={() => handleQuantityChange(item, true)}
                  className="border-hairline border-gray-300 rounded-full p-1 bg-black"
                />
              </View>
            </View>
          </View>
        ))}
        {cart.length === 0 && (
          <View className="flex-1 items-center justify-center">
            <Image
              source={require("@/assets/images/empty-cart.png")}
              className="w-64 h-64 mb-8"
            />
            <Text
              className="text-lg text-gray-700 mb-4"
              style={{ fontFamily: "Unbounded Medium" }}
            >
              Your cart is empty
            </Text>
            <Text
              className="text-center w-80 text-gray-500 mb-8 text-xs"
              style={{ fontFamily: "Unbounded Light" }}
            >
              Fill up your cart with fresh groceries and everyday essentials.
              Start shopping now!
            </Text>
            <Pressable
              className="w-[56%] px-8 py-5 rounded-full border-hairline border-[#014E3C]"
              onPress={() => router.push("/home")}
            >
              <Text
                className="text-[#014E3C] text-xs text-center"
                style={{ fontFamily: "Unbounded SemiBold" }}
              >
                View trending items
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      <View className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-0 left-0 right-0">
        <Pressable
          className="bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white"
          onPress={() => console.log("Checkout")}
        >
          <Text
            className="text-white text-xs text-center"
            style={{ fontFamily: "Unbounded SemiBold" }}
          >
            Go to Checkout
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default CartComponent;
