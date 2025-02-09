import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  Alert,
  BackHandler,
} from "react-native";
import LottieView from "lottie-react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCartStore } from "../store/cartStore";

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

const PaymentProcessingScreen = () => {
  const cart = useCartStore((state) => (state as CartState).cart);
  const clearCart = useCartStore((state) => (state as CartState).clearCart);
  const [status, setStatus] = useState("processing");
  const [fadeAnim] = useState(new Animated.Value(1));
  type OrderItem = {
    _id: string;
    imageUrl: string;
    // Add other properties if needed
  };

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const handleBackPress = () => {
    router.push("/(tabs)/shop");
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      createOrder();
      console.log("Payment Processing Screen");

      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const body = {
    user: "gid_123456789",
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      imageUrl: item.imageUrl,
      unitOfMeasure: item.unitOfMeasure,
    })),
    deliveryAddress: {
      street: "123 Main Street",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "USA",
      coordinates: [-118.2437, 34.0522],
    },
    payment: "65f1b2c4a3e7b2d123456789",
    specialInstructions: "Leave the package at the front door.",
  };
  const createOrder = async () => {
    try {
      const response = await fetch("http://192.168.43.155:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      const data = await result;
      console.log(data);

      if (data.order && data.order._id) {
        setOrderItems(data.order.items);
        console.log(data.order);
        clearCart();
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };
  return (
    <>
      <View className="flex-1 bg-white p-5 items-center justify-center">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        {status === "processing" ? (
          <Animated.View
            className="items-center mt-10 z-40"
            style={{ opacity: fadeAnim }}
          >
            <LottieView
              style={{ width: 100, height: 100 }}
              autoPlay
              loop={true}
              source={require("@/assets/animations/bounce.json")}
            />
            {/* <ActivityIndicator size="large" color="#4CAF50" /> */}
            <Text
              className="text-lg text-gray-700 mb-4"
              style={{ fontFamily: "Unbounded Medium" }}
            >
              Processing Payment
            </Text>
            <Text
              className="text-center w-80 text-gray-500 mb-8 text-xs"
              style={{ fontFamily: "Unbounded Light" }}
            >
              Please wait while we verify your details. This usually takes 30
              seconds.
            </Text>
          </Animated.View>
        ) : (
          <View className="items-center">
            <LottieView
              style={{ width: 150, height: 150 }}
              autoPlay
              loop={false}
              source={require("@/assets/animations/basket.json")}
            />
            <Text
              className="text-lg text-gray-700 mb-4"
              style={{ fontFamily: "Unbounded Medium" }}
            >
              Packing your order...
            </Text>
            <Text
              className="text-center w-80 text-gray-500 mb-8 text-xs"
              style={{ fontFamily: "Unbounded Light" }}
            >
              Your order has been confirmed. You will receive an email
              confirmation shortly.
            </Text>

            <View className="p-3 w-full mb-8 flex-row items-center justify-start rounded-2xl bg-slate-50">
              {orderItems.slice(0, 5).map((item, index) => (
                <View key={item._id} className="mb-2">
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
              ))}
              {orderItems.length > 5 && (
                <Text
                  className="text-[#2BCC5A] p-3 rounded-full text-xs flex items-center justify-center"
                  style={{
                    fontFamily: "Unbounded SemiBold",
                    width: 40,
                    height: 40,
                    backgroundColor: "#2BCC5A20",
                  }}
                >
                  {orderItems.length - 5}
                </Text>
              )}
            </View>
            <Pressable
              className="w-[56%] px-8 py-5 rounded-full border-hairline border-[#014E3C]"
              onPress={() => router.push("/home")}
            >
              <Text
                className="text-[#014E3C] text-xs text-center"
                style={{ fontFamily: "Unbounded SemiBold" }}
              >
                View my orders
              </Text>
            </Pressable>
          </View>
        )}
      </View>
      <View
        style={{ paddingBottom: Platform.OS === "ios" ? 20 : 12 }}
        className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-0 left-0 right-0"
      >
        <Pressable
          className="bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white"
          onPress={() => router.push("/(tabs)/shop")}
          disabled={status === "processing"}
        >
          {status === "processing" ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text
              className="text-white text-xs text-center"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              Continue Shopping
            </Text>
          )}
        </Pressable>
      </View>
    </>
  );
};

export default PaymentProcessingScreen;
