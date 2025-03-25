import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Alert,
  Animated,
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

  const body = {
    isPeakHour: new Date().getHours() >= 14 && new Date().getHours() <= 18,
    distance: 5,
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
      const response = await fetch("http://192.168.43.155:3000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

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
    <View className="flex-1 bg-[#f8fafc]">
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          title: "Order Summary",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Unbounded Regular", fontSize: 14 },
        }}
      />
      {/* Delivery Progress Banner */}
      <View className="bg-[#2BCC5A] px-4 py-3 flex-row items-center justify-between">
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
      </View>

      <ScrollView
        className="px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Order Summary Section */}
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="font-UnboundedMedium text-gray-800 text-lg mb-4">
            Your Order Summary ({cart.length} Items)
          </Text>

          {/* Expandable Pricing Section */}
          <View className="space-y-2">
            <View className="flex-row justify-between items-center">
              <Text className="font-UnboundedLight text-gray-600">
                Subtotal
              </Text>
              <Text className="font-UnboundedMedium text-gray-800">
                GHS {data?.subtotal?.toFixed(2)}
              </Text>
            </View>

            {expanded && (
              <>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center space-x-2">
                    <Ionicons name="car" size={16} color="#4b5563" />
                    <Text className="font-UnboundedLight text-gray-600">
                      Delivery Fee
                    </Text>
                  </View>
                  <Text className="font-UnboundedMedium text-gray-800">
                    GHS{" "}
                    {(
                      (data?.deliveryFee || 0) + (data?.distanceFee || 0)
                    ).toFixed(2)}
                  </Text>
                </View>

                {(data?.peakSurcharge ?? 0) > 0 && (
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center space-x-2">
                      <Ionicons name="alert-circle" size={16} color="#dc2626" />
                      <Text className="font-UnboundedLight text-red-600">
                        Peak Hours Fee
                      </Text>
                    </View>
                    <Text className="font-UnboundedMedium text-red-600">
                      +GHS {(data?.peakSurcharge ?? 0).toFixed(2)}
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center space-x-2">
                    <Ionicons
                      name="shield-checkmark"
                      size={16}
                      color="#4b5563"
                    />
                    <Text className="font-UnboundedLight text-gray-600">
                      Service Fee
                    </Text>
                  </View>
                  <Text className="font-UnboundedMedium text-gray-800">
                    GHS {(data?.platformFee || 0).toFixed(2)}
                  </Text>
                </View>
              </>
            )}

            <Pressable onPress={toggleDetails} className="pt-2">
              <View className="flex-row items-center justify-center space-x-1">
                <Animated.View
                  style={{ transform: [{ rotate: rotateInterpolate }] }}
                >
                  <Ionicons name="chevron-down" size={16} color="#2BCC5A" />
                </Animated.View>
                <Text className="text-[#2BCC5A] font-UnboundedSemiBold text-sm">
                  {expanded ? "Show Less" : "View Cost Breakdown"}
                </Text>
              </View>
            </Pressable>

            <View className="border-t border-gray-200 mt-3 pt-3">
              <View className="flex-row justify-between items-center">
                <Text className="font-UnboundedSemiBold text-gray-900 text-lg">
                  Total Payment
                </Text>
                <Text className="font-UnboundedBold text-[#2BCC5A] text-xl">
                  GHS {data?.total?.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View className="mt-6">
          <Text className="font-UnboundedMedium text-gray-800 text-lg mb-4">
            Choose Payment Method
          </Text>

          <View className="flex-row gap-3">
            {/* Mobile Money Option */}
            <Pressable
              onPress={() => setSelectedPayment("online")}
              className={`flex-1 p-4 rounded-lg border-2 ${
                selectedPayment === "online"
                  ? "border-[#2BCC5A] bg-[#2BCC5A]/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="items-center space-y-2">
                <MaterialIcons
                  name="phone-android"
                  size={28}
                  color={selectedPayment === "online" ? "#2BCC5A" : "#4b5563"}
                />
                <Text
                  className={`font-UnboundedSemiBold text-sm ${
                    selectedPayment === "online"
                      ? "text-[#2BCC5A]"
                      : "text-gray-700"
                  }`}
                >
                  Mobile Money
                </Text>
                <Text className="font-UnboundedLight text-gray-500 text-xs text-center">
                  Instant payment via Momo/AirtelTigo
                </Text>
              </View>
            </Pressable>

            {/* Cash on Delivery Option */}
            <Pressable
              onPress={() => setSelectedPayment("cash")}
              className={`flex-1 p-4 rounded-lg border-2 ${
                selectedPayment === "cash"
                  ? "border-[#2BCC5A] bg-[#2BCC5A]/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="items-center space-y-2">
                <MaterialIcons
                  name="money"
                  size={28}
                  color={selectedPayment === "cash" ? "#2BCC5A" : "#4b5563"}
                />
                <Text
                  className={`font-UnboundedSemiBold text-sm ${
                    selectedPayment === "cash"
                      ? "text-[#2BCC5A]"
                      : "text-gray-700"
                  }`}
                >
                  Cash on Delivery
                </Text>
                <Text className="font-UnboundedLight text-gray-500 text-xs text-center">
                  Pay when you receive items
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Trust Badges */}
        <View className="mt-6 flex-row justify-center space-x-4">
          <Ionicons name="lock-closed" size={20} color="#2BCC5A" />
          <Text className="font-UnboundedLight text-gray-600 text-xs text-center">
            256-bit SSL Encryption • PCI DSS Compliant\nApproved by Bank of
            Ghana
          </Text>
        </View>
      </ScrollView>

      {/* Sticky Confirm Button */}
      <View className="bg-white pt-4 px-4 pb-6 border-t border-gray-100">
        <Pressable
          onPress={handlePayment}
          className={`w-full py-4 rounded-full ${
            loading ? "bg-gray-400" : "bg-[#2BCC5A]"
          } flex-row items-center justify-center space-x-2`}
          android_ripple={{ color: "#229544" }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="lock-closed" size={20} color="white" />
              <Text className="font-UnboundedSemiBold text-white text-sm">
                Confirm Secure Payment
              </Text>
            </>
          )}
        </Pressable>
        <Text className="font-UnboundedLight text-gray-500 text-xs text-center mt-2">
          By continuing, you agree to our Terms of Service\nPowered by Hubtel
          Payments
        </Text>
      </View>
    </View>
  );
};

export default Payment;
