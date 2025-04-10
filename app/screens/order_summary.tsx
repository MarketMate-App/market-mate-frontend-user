import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { useCartStore } from "../store/cartStore";
import { set } from "react-hook-form";
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

const OrderSummaryScreen = () => {
  const [data, setData] = useState<{ total: number } | null>(null);
  const cart = useCartStore((state) => (state as unknown as CartState).cart);
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/");
    }
    fetchTotal();
  }, []);

  const fetchTotal = () => {
    console.log("fetching total");

    const body = {
      // Calcualte peak hours based on current time of day between 2pm and 6pm

      isPeakHour: new Date().getHours() >= 14 && new Date().getHours() <= 18,
      distance: 5,
      promoCode: "",
      items: cart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/calculate-total`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <View className="flex-1 bg-white px-3">
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          title: "Order Summary",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Unbounded Regular", fontSize: 14 },
        }}
      />
      <Text
        className="text-xs text-gray-500 mb-2"
        style={{ fontFamily: "Unbounded Regular" }}
      >
        Order Summary
      </Text>
      <Text
        className="text-xs text-gray-500 mb-2"
        style={{ fontFamily: "Unbounded Regular" }}
      >
        Delivery Fees
      </Text>
      <Text
        className="text-xs text-gray-500 mb-2"
        style={{ fontFamily: "Unbounded Regular" }}
      >
        Total Amount Payable (GHS) {data?.total ?? 0}
      </Text>
    </View>
  );
};

export default OrderSummaryScreen;
