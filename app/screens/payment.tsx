import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Alert,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router, Stack } from "expo-router";
import { useCartStore } from "../store/cartStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const Payment = () => {
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
  type TotalData = {
    total: number;
    deliveryFee: number;
    platformFee: number;
    distanceFee: number;
    peakSurcharge: number;
    subtotal: number;
    deliveryDiscounts: number;
  };

  const [loading, setLoading] = useState(false);
  const [totalError, setTotalError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<"cash" | "online">(
    "cash"
  );
  const cart = useCartStore((state) => (state as unknown as CartState).cart);
  const [data, setData] = useState<TotalData | null>(null);
  const [userLocation, setUserLocation] = useState<{
    coords: { latitude: number; longitude: number };
  } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Radius of the Earth in km
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  const marketLocation = { latitude: 4.9209, longitude: -1.7587 }; // Coordinates for Takoradi Market
  const rawDistance = calculateDistance(
    marketLocation.latitude,
    marketLocation.longitude,
    userLocation?.coords.latitude || 0,
    userLocation?.coords.longitude || 0
  );
  const maxAllowedDistance = 50; // maximum allowed distance in km
  const distance =
    rawDistance > maxAllowedDistance ? maxAllowedDistance : rawDistance;
  const body = {
    isPeakHour: new Date().getHours() >= 14 && new Date().getHours() <= 18,
    distance: distance,
    promoCode: "",
    items: cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  const fetchTotal = async () => {
    setLoading(true);
    setTotalError(null);
    try {
      const response = await fetch(
        "http://192.168.43.155:3000/api/calculate-total",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const totalData: TotalData = await response.json();
      setData(totalData);
    } catch (error: any) {
      console.error("Error fetching total:", error);
      setTotalError(error.message || "An unknown error occurred");
      Alert.alert(
        "Oops!",
        "We couldn't calculate the total. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLocation = async () => {
    const savedLocation = await SecureStore.getItemAsync("userLocation");
    const userFromStore = await SecureStore.getItemAsync("user");
    if (!userFromStore) {
      const newUser = {
        name: "John Doe",
        phone: "233123456789",
      };
      await SecureStore.setItemAsync("user", JSON.stringify(newUser));
    } else {
      setUser(JSON.parse(userFromStore));
    }
    if (savedLocation) {
      const coordinates = JSON.parse(savedLocation);
      setUserLocation(coordinates);
    } else {
      setUserLocation(null);
    }
  };

  const createOrder = async () => {
    const amount = data?.total;
    if (!user || !userLocation || cart.length === 0) {
      Alert.alert("Error", "Missing required information. Please try again.");
      router.replace("/(tabs)/shop");
      return;
    }

    const orderData = {
      user,
      items: cart.map(
        ({ id, name, quantity, price, imageUrl, unitOfMeasure }) => ({
          id,
          name,
          quantity,
          price,
          imageUrl,
          unitOfMeasure,
        })
      ),
      deliveryAddress: {
        street: "123 Main Street",
        city: "Takoradi",
        state: "WS",
        postalCode: "00233",
        country: "Ghana",
        coordinates: [
          userLocation.coords.latitude,
          userLocation.coords.longitude,
        ],
      },
      payment: {
        amount: amount,
        method: "cash-on-delivery",
      },
      courier: "67dbf39b18342fc23a061fee",
    };

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      if (data?.order?._id) {
        setOrderItems(data.order.items);
      } else {
        throw new Error("Invalid response: Order ID missing");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Order Error", "There was an issue processing your order.");
    }
  };

  const handlePayment = () => {
    if (userLocation === null) {
      Alert.alert("Location Required", "Please set a delivery location.");
      router.push("/location");
      return;
    }
    if (selectedPayment === "cash") {
      createOrder();
      router.replace("/screens/payment_processing");
      return;
    } else {
      Alert.alert(
        "Payment Error",
        "Online payment is not supported yet. Please select Cash on Delivery."
      );
    }
  };

  useEffect(() => {
    console.log(process.env.EXPO_PUBLIC_TEST);
    fetchLocation();
    if (cart.length === 0) router.replace("/");
    fetchTotal();
  }, []);
  // ... Keep all type definitions and state declarations ...
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleDetails = () => {
    Animated.spring(rotateAnim, {
      toValue: expanded ? 0 : 1,
      useNativeDriver: true,
    }).start();
    setExpanded(!expanded);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <SafeAreaView className="flex-1 bg-[#f8fafc]">
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          title: "Order Summary",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Unbounded Regular", fontSize: 14 },
        }}
      />
      {/* Delivery Progress Banner */}
      {/* <View className="bg-[#2BCC5A] px-4 py-3 flex-row items-center justify-between">
        <View>
          <Text
            className="text-white"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Delivery Progress
          </Text>
          <Text
            className="text-white/90 text-xs mt-1"
            style={{ fontFamily: "Unbounded Light" }}
          >
            Next Stop: Your Doorstep • {user?.city || "Takoradi"}
          </Text>
        </View>
        <Ionicons name="location" size={20} color="white" />
      </View> */}

      <ScrollView
        className="px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* Order Summary Section */}
        <View className=" bg-white rounded-3xl shadow-xs">
          {/* Ticket Notch */}
          <View className="absolute -top-3 left-8 right-8 h-3 bg-white rounded-t-full" />

          <View className="p-6">
            {/* Items Preview */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {cart.map((item) => (
                <View
                  key={item.id}
                  className="bg-[#f1f5f9] px-4 py-2 rounded-xl mr-3"
                >
                  <Text
                    style={{ fontFamily: "Unbounded Regular" }}
                    className="text-gray-700 text-xs"
                  >
                    {item.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text
                      style={{ fontFamily: "Unbounded Light" }}
                      className="text-gray-500 text-xs mr-2"
                    >
                      ×{item.quantity}
                    </Text>
                    <Text
                      style={{ fontFamily: "Unbounded Light" }}
                      className="text-[#2BCC5A] text-xs"
                    >
                      {item.unitOfMeasure}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Pricing Breakdown */}
            <View className="">
              <View className="flex-row justify-between">
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Unbounded Light" }}
                >
                  Subtotal
                </Text>
                <Text
                  className="text-gray-900"
                  style={{ fontFamily: "Unbounded Medium" }}
                >
                  GHS {data?.subtotal?.toFixed(2)}
                </Text>
              </View>

              {expanded && (
                <>
                  <View className="flex-row justify-between">
                    <View className="flex-row items-center gap-2">
                      <Text
                        className="text-gray-600 text-sm"
                        style={{ fontFamily: "Unbounded Light" }}
                      >
                        Delivery
                      </Text>
                      <Ionicons name="bicycle" size={16} color="#4b5563" />
                    </View>
                    <Text
                      className="text-gray-900"
                      style={{ fontFamily: "Unbounded Medium" }}
                    >
                      GHS{" "}
                      {(
                        (data?.deliveryFee ?? 0) + (data?.distanceFee ?? 0)
                      ).toFixed(2)}
                    </Text>
                  </View>

                  {(data?.peakSurcharge ?? 0) > 0 && (
                    <View className="flex-row justify-between">
                      <View className="flex-row items-center gap-2">
                        <Text
                          className="text-red-600 text-sm"
                          style={{ fontFamily: "Unbounded Light" }}
                        >
                          Peak Surcharge
                        </Text>
                        <Ionicons
                          name="alert-circle"
                          size={16}
                          color="#ef4444"
                        />
                      </View>
                      <Text
                        className="text-red-600"
                        style={{ fontFamily: "Unbounded Medium" }}
                      >
                        +GHS {data?.peakSurcharge?.toFixed(2) || "0.00"}
                      </Text>
                    </View>
                  )}

                  <View className="flex-row justify-between">
                    <View className="flex-row items-center gap-2">
                      <Text
                        className="text-gray-600 text-sm"
                        style={{ fontFamily: "Unbounded Light" }}
                      >
                        Platform Fee
                      </Text>
                      <Ionicons
                        name="shield-checkmark"
                        size={16}
                        color="#4b5563"
                      />
                    </View>
                    <Text
                      className="text-gray-900"
                      style={{ fontFamily: "Unbounded Medium" }}
                    >
                      GHS {data?.platformFee.toFixed(2)}
                    </Text>
                  </View>
                </>
              )}

              {/* Total Amount */}
              <View className="pt-4 mt-4 border-t border-dashed border-gray-200">
                <View className="flex-row justify-between">
                  <Text
                    className="text-gray-900"
                    style={{ fontFamily: "Unbounded Regular" }}
                  >
                    Total Amount
                  </Text>
                  <Text
                    className="text-xl text-[#2BCC5A]"
                    style={{ fontFamily: "Unbounded SemiBold" }}
                  >
                    GHS {data?.total?.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Expand Button */}
            <TouchableOpacity
              onPress={toggleDetails}
              className="flex-row items-center justify-center mt-6"
            >
              <Animated.View
                style={{ transform: [{ rotate: rotateInterpolate }] }}
              >
                <Ionicons name="chevron-down" size={20} color="#2BCC5A" />
              </Animated.View>
              <Text
                className="ml-2 text-[#2BCC5A] text-xs"
                style={{ fontFamily: "Unbounded Light" }}
              >
                {expanded ? "Show less" : "View cost breakdown"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View className="mt-2 bg-white rounded-3xl shadow-xs p-6">
          <Text
            className=" text-gray-800 mb-4"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Choose Payment Method
          </Text>

          <View className=" gap-3">
            {/* Mobile Money Option */}
            <Pressable
              onPress={() => setSelectedPayment("online")}
              className={`flex-1 p-4 rounded-2xl border-hairline ${
                selectedPayment === "online"
                  ? "border-[#2BCC5A] bg-[#2BCC5A]/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="items-center space-y-2">
                <MaterialIcons
                  name="phone-iphone"
                  size={24}
                  color={selectedPayment === "online" ? "#2BCC5A" : "#4b5563"}
                />
                <Text
                  style={{ fontFamily: "Unbounded Regular" }}
                  className={`text-sm ${
                    selectedPayment === "online"
                      ? "text-[#2BCC5A]"
                      : "text-gray-700"
                  }`}
                >
                  Mobile Money
                </Text>
                <Text
                  className=" text-gray-500 text-[9px] text-center"
                  style={{ fontFamily: "Unbounded Light" }}
                >
                  Instant payment via Momo.
                </Text>
              </View>
            </Pressable>

            {/* Cash on Delivery Option */}
            <Pressable
              onPress={() => setSelectedPayment("cash")}
              className={`flex-1 p-4 rounded-2xl border-hairline ${
                selectedPayment === "cash"
                  ? "border-[#2BCC5A] bg-[#2BCC5A]/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="items-center space-y-2">
                <MaterialIcons
                  name="wallet"
                  size={24}
                  color={selectedPayment === "cash" ? "#2BCC5A" : "#4b5563"}
                />
                <Text
                  style={{ fontFamily: "Unbounded Regular" }}
                  className={` text-sm ${
                    selectedPayment === "cash"
                      ? "text-[#2BCC5A]"
                      : "text-gray-700"
                  }`}
                >
                  Cash on Delivery
                </Text>
                <Text
                  style={{ fontFamily: "Unbounded Light" }}
                  className=" text-gray-500 text-[9px] text-center"
                >
                  Pay when you receive items
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Confirm Button */}
      <View className="bg-white pt-4 px-4 pb-10 border-t border-gray-100">
        <Pressable
          onPress={handlePayment}
          className={`w-full py-4 rounded-full ${
            loading ? "bg-gray-400" : "bg-[#2BCC5A]"
          } flex-row items-center justify-center space-x-2`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Text
                className="text-white text-xs"
                style={{ fontFamily: "Unbounded SemiBold" }}
              >
                Continue to order
              </Text>
            </>
          )}
        </Pressable>
        <Text
          style={{ fontFamily: "Unbounded Light" }}
          className="text-gray-500 text-xs text-center mt-2"
        >
          By continuing, you agree to our Terms of Services
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Payment;
