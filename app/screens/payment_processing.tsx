import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  Image,
  Platform,
  Pressable,
  BackHandler,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { router, Stack, useFocusEffect } from "expo-router";
import { useCartStore } from "../store/cartStore";
import * as SecureStore from "expo-secure-store";

interface User {
  id: string;
  name: string;
  // additional user fields if necessary
}

interface LocationData {
  coords: {
    latitude: number;
    longitude: number;
  };
}

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string;
  unitOfMeasure: string;
}

interface Order {
  _id: string;
  items: CartItem[];
  deliveryAddress: {
    coordinates: [number, number];
  };
  courier?: string;
  user: User;
}
type CartState = {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
  clearCart: () => void;
};
type Status = "processing" | "success" | "error";

const PaymentProcessingScreen: React.FC = () => {
  const cart = useCartStore((state) => (state as unknown as CartState).cart);
  const removeFromCart = useCartStore(
    (state) => (state as unknown as CartState).removeFromCart
  );
  const clearCart = useCartStore(
    (state) => (state as unknown as CartState).clearCart
  );
  const [status, setStatus] = useState<Status>("processing");
  const [fadeAnim] = useState(new Animated.Value(1));
  const [user, setUser] = useState<User | null>(null);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);

  const handleBackPress = useCallback((): boolean => {
    router.replace("/(tabs)/shop");
    return true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        try {
          const locationData = await SecureStore.getItemAsync("userLocation");
          if (locationData) setUserLocation(JSON.parse(locationData));
        } catch (error) {
          console.error("Error retrieving SecureStore data:", error);
          Alert.alert("Error", "Unable to load user data.");
        }
      };

      loadUserData();
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, [handleBackPress])
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 4000);
    return () => clearTimeout(timer);
  }, [fadeAnim]);

  useEffect(() => {
    if (userLocation) {
      createOrder();
    }
  }, [userLocation]);

  const createOrder = async () => {
    if (!userLocation?.coords || cart.length === 0) {
      setStatus("error");
      Alert.alert("Error", "Missing required information. Please try again.");
      router.replace("/(tabs)/shop");
      return;
    }

    try {
      if (cart.length === 0) {
        throw new Error("No items in the cart");
      }
      const items = [...cart];
      setOrderItems(items);
      clearCart();
      setStatus("success");
    } catch (error) {
      console.error("Error creating order:", error);
      setStatus("error");
      Alert.alert("Order Error", "There was an issue processing your order.");
    }
  };

  return (
    <>
      <View className="flex-1 bg-white p-5 items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />

        {status === "processing" ? (
          <Animated.View
            className="items-center mt-10 z-40"
            style={{ opacity: fadeAnim }}
          >
            <LottieView
              style={{ width: 100, height: 100 }}
              autoPlay
              loop
              source={require("@/assets/animations/bounce.json")}
            />
            <Text
              className="text-lg text-gray-700 mb-4"
              style={{ fontFamily: "Unbounded Medium" }}
            >
              Processing Order
            </Text>
            <Text
              className="text-center w-80 text-gray-500 mb-8 text-xs"
              style={{ fontFamily: "Unbounded Regular" }}
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
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Your order has been confirmed. You will receive an SMS
              confirmation shortly.
            </Text>

            <View className="p-3 w-full mb-8 flex-row items-center justify-start rounded-2xl bg-slate-50">
              {orderItems.slice(0, 5).map((item, index) => (
                <View key={`order-item-${item.id}-${index}`} className="mb-2">
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                  />
                </View>
              ))}
              {orderItems.length > 5 && (
                <Text
                  key="order-item-summary"
                  className="text-[#2BCC5A] p-3 rounded-full text-xs text-center items-center justify-center"
                  style={{
                    fontFamily: "Unbounded SemiBold",
                    width: 40,
                    height: 40,
                    backgroundColor: "#2BCC5A20",
                  }}
                >
                  + {orderItems.length - 5}
                </Text>
              )}
            </View>
            <Pressable
              className="w-[56%] px-8 py-5 rounded-full border-hairline border-[#014E3C]"
              onPress={() => router.replace("/screens/userOrders")}
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
          onPress={() => router.replace("/(tabs)/shop")}
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
