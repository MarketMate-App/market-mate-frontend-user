import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { router, Stack } from "expo-router";
import { useCartStore } from "../store/cartStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { Paystack, paystackProps } from "react-native-paystack-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Payment = () => {
  const paystackWebViewRef = useRef<paystackProps.PayStackRef>();
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
    "online"
  );
  const cart = useCartStore((state) => (state as unknown as CartState).cart);
  const [data, setData] = useState<TotalData | null>(null);
  const [userLocation, setUserLocation] = useState<{
    coords: { latitude: number; longitude: number };
  } | null>(null);
  const [user, setUser] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [cashOnDeliveryDisabled, setCashOnDeliveryDisabled] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>("");
  const fetchTotal = async () => {
    setLoading(true);
    setTotalError(null);

    try {
      // Fetch location from SecureStore before proceeding
      const savedLocation = await SecureStore.getItemAsync("userLocation");
      if (!savedLocation) {
        throw new Error("User location is missing or invalid.");
      }

      const coordinates = JSON.parse(savedLocation);
      setUserLocation(coordinates);

      if (!process.env.EXPO_PUBLIC_API_URL) {
        throw new Error("API URL is not defined in environment variables.");
      }

      const requestBody = {
        isPeakHour: new Date().getHours() >= 14 && new Date().getHours() <= 18,
        location: {
          latitude: coordinates.coords.latitude || 0,
          longitude: coordinates.coords.longitude || 0,
        },
        promoCode: "",
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL ||
          "https://marketmate-backend.onrender.com"
        }/api/calculate-total`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }

      const totalData: TotalData = await response.json();
      setData(totalData);
    } catch (error: any) {
      // console.error("Error fetching total:", error);
      setTotalError(error.message || "An unknown error occurred");
      Alert.alert(
        "Oops!",
        "We couldn't calculate the total. Please check your location and try again."
      );
    } finally {
      setLoading(false);
      fetchUser();
    }
  };

  const fetchLocation = async () => {
    const savedLocation = await SecureStore.getItemAsync("userLocation");
    if (savedLocation) {
      const coordinates = JSON.parse(savedLocation);
      setUserLocation(coordinates);
    } else {
      setUserLocation(null);
    }
  };
  const fetchUser = async () => {
    try {
      const userDetails = await AsyncStorage.getItem("@userDetails");
      if (userDetails) {
        setUser(JSON.parse(userDetails));
        const totalOrderAmount = JSON.parse(userDetails).totalOrderAmount || 0;

        // Disable cash on delivery based on user order history and total amount
        const threshold = parseFloat(
          process.env.EXPO_PUBLIC_USER_AMOUNT_THRESHOLD || "500"
        ); // Minimum order history threshold
        const maxAllowedAmount = parseFloat(
          process.env.EXPO_PUBLIC_MAX_CASH_ON_DELIVERY_AMOUNT || "2000"
        ); // Maximum allowed amount for cash on delivery

        const isBelowThreshold = totalOrderAmount < threshold;
        const exceedsMaxAllowed = (data?.total ?? 0) > maxAllowedAmount;

        const shouldDisableCashOnDelivery =
          isBelowThreshold || exceedsMaxAllowed;

        setCashOnDeliveryDisabled(shouldDisableCashOnDelivery);
      } else {
        // console.warn("No user details found in storage.");
      }
    } catch (error) {
      // console.error("Error fetching user details:", error);
    }
  };
  const createOrder = async () => {
    if (!userLocation || !user || cart.length === 0 || !data) {
      Alert.alert(
        "Missing Information",
        "Please ensure your location, user details, cart items, and total data are available before proceeding."
      );
      return;
    }
    try {
      const jwtToken = await SecureStore.getItemAsync("jwtToken");
      const items = await AsyncStorage.multiGet([
        "@phoneNumber",
        "@userDetails",
      ]);
      if (!jwtToken) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      if (!items) {
        throw new Error("User not found. Please log in again.");
      }

      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL ||
          "https://marketmate-backend.onrender.com"
        }/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            // courier: "67dbf39b18342fc23a061fee",

            items: cart.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              imageUrl: item.imageUrl,
              discount: 0, // Assuming no discount for now
              unitOfMeasure: item.unitOfMeasure,
              total: item.price * item.quantity,
            })),
            totalAmount: data?.total,
            deliveryAddress: {
              street: user?.address?.street || "123 Main Street", // Replace with actual address
              city: user?.address?.city || "Accra", // Replace with actual city
              state: user?.address?.state || "Greater Accra", // Replace with actual state
              postalCode: user?.address?.postalCode || "00233", // Replace with actual postal code
              country: user?.address?.country || "Ghana", // Replace with actual country
              coordinates: [
                userLocation?.coords.longitude || 0,
                userLocation?.coords.latitude || 0,
              ],
            },
            payment: {
              amount: data?.total,
              method:
                selectedPayment === "cash"
                  ? "cash-on-delivery"
                  : "mobile-money",
              status: selectedPayment === "cash" ? "pending" : "completed",
              transactionId: null, // Replace with actual transaction ID if available
            },
            specialInstructions: specialInstructions || "NA",
            status: "confirmed",
            packagingType: "standard",
            orderType: "instant",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order.");
      }

      const orderData = await response.json();
      // console.log(orderData);
      // console.log("Order created successfully:", orderData);
    } catch (error) {
      // console.error("Error creating order:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred while creating the order.";
      Alert.alert("Order Error", errorMessage);
    }
  };
  const handlePayment = async () => {
    if (loading) return; // Prevent multiple clicks
    setLoading(true);

    if (selectedPayment === "cash" && cashOnDeliveryDisabled) {
      Alert.alert(
        "Cash on Delivery Unavailable",
        "Cash on delivery is not available for users with insufficient order history. Please use Mobile Money."
      );
      setLoading(false);
      return;
    }
    if (selectedPayment === "cash" && (data?.total ?? 0) > 2000) {
      Alert.alert(
        "Cash on Delivery Unavailable",
        "Cash on delivery is not available for orders exceeding GHS 2000. Please use Mobile Money."
      );
      setLoading(false);
      return;
    }
    if (selectedPayment === "online" && !data) {
      Alert.alert(
        "Payment Error",
        "Unable to process payment. Please check your order details."
      );
      setLoading(false);
      return;
    }

    if (!data?.total || data.total <= 0) {
      Alert.alert(
        "Invalid Total",
        "The total amount is missing or invalid. Please try again."
      );
      return;
    }
    if (userLocation === null) {
      Alert.alert("Location Required", "Please set a delivery location.");
      router.push("/location");
      return;
    }
    const jwtToken = await SecureStore.getItemAsync("jwtToken");
    if (!jwtToken) {
      Alert.alert("Authentication Required", "Please log in to continue.");
      router.replace("/auth");
      return;
    }
    if (selectedPayment === "cash") {
      createOrder();
      router.replace("/screens/payment_processing");
      return;
    } else {
      if (!data?.total || data.total <= 0) {
        Alert.alert(
          "Invalid Total",
          "The total amount is missing or invalid. Please try again."
        );
        return;
      }
      paystackWebViewRef.current?.startTransaction();
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchLocation();
      await fetchUser();

      if (cart.length === 0) {
        router.replace("/");
        return;
      }

      if (!userLocation?.coords) {
        await fetchLocation();
      }

      fetchTotal();
    };

    initialize();
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
    <SafeAreaView className="bg-[#f8fafc] relative flex-1">
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          title: "Order Summary",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "WorkSans Bold", fontSize: 14 },
        }}
      />
      {/* Delivery Progress Banner */}
      <View className="bg-[#2BCC5A] px-4 py-3 flex-row items-center justify-between">
        <View className="flex-1">
          <Text
            className="text-white text-sm"
            style={{ fontFamily: "WorkSans Bold" }}
          >
            Next Stop: Your Doorstep
          </Text>
          <Text
            className="text-white/80 text-xs mt-1"
            style={{ fontFamily: "WorkSans Regular" }}
          >
            {userLocation
              ? `Current Location: ${userLocation.coords.latitude.toFixed(
                  4
                )}, ${userLocation.coords.longitude.toFixed(4)}`
              : "Fetching your location..."}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/location")}
          className="flex-row items-center space-x-2"
        >
          <Ionicons name="location" size={20} color="white" />
          <Text
            className="text-white text-xs"
            style={{ fontFamily: "WorkSans Medium" }}
          >
            Update Location
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1 }}>
          <Paystack
            paystackKey={`${process.env.EXPO_PUBLIC_PAYSTACK_KEY}`}
            billingName="MarketMate"
            channels={["mobile_money"]}
            currency="GHS"
            billingEmail="customer@marketmate.com"
            amount={data?.total ?? 0}
            onCancel={() =>
              Alert.alert("Payment Cancelled", "Transaction was cancelled.")
            }
            onSuccess={() => {
              createOrder();
              router.replace("/screens/payment_processing");
            }}
            ref={paystackWebViewRef}
          />
        </View>

        {/* Order Summary Section */}
        <View className="bg-white rounded-3xl shadow-xs">
          <View className="absolute -top-3 left-8 right-8 h-3 bg-white rounded-t-full" />
          <View className="p-6">
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
                    style={{ fontFamily: "WorkSans Regular" }}
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

            <View>
              <View className="flex-row justify-between">
                <Text
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "WorkSans Light" }}
                >
                  Subtotal
                </Text>
                {loading ? (
                  <ActivityIndicator size="small" color="#2BCC5A" />
                ) : (
                  <Text
                    className="text-gray-900"
                    style={{ fontFamily: "Unbounded Medium" }}
                  >
                    GHS {data?.subtotal?.toFixed(2) || "0.00"}
                  </Text>
                )}
              </View>

              {expanded && (
                <>
                  <View className="flex-row justify-between">
                    <Text
                      className="text-gray-600 text-sm"
                      style={{ fontFamily: "WorkSans Light" }}
                    >
                      Delivery
                    </Text>
                    <Text
                      className="text-gray-900"
                      style={{ fontFamily: "Unbounded Medium" }}
                    >
                      GHS{" "}
                      {(
                        (data?.deliveryFee ?? 0) + (data?.distanceFee ?? 0)
                      ).toFixed(2) || "0.00"}
                    </Text>
                  </View>

                  {(data?.peakSurcharge ?? 0) > 0 && (
                    <View className="flex-row justify-between">
                      <Text
                        className="text-red-600 text-sm"
                        style={{ fontFamily: "WorkSans Light" }}
                      >
                        Busy Hour Fee
                      </Text>
                      <Text
                        className="text-red-600"
                        style={{ fontFamily: "Unbounded Medium" }}
                      >
                        +GHS {data?.peakSurcharge?.toFixed(2) || "0.00"}
                      </Text>
                    </View>
                  )}

                  <View className="flex-row justify-between">
                    <Text
                      className="text-gray-600 text-sm"
                      style={{ fontFamily: "WorkSans Light" }}
                    >
                      Platform Fee
                    </Text>
                    <Text
                      className="text-gray-900"
                      style={{ fontFamily: "Unbounded Medium" }}
                    >
                      GHS {data?.platformFee.toFixed(2) || "0.00"}
                    </Text>
                  </View>
                </>
              )}

              <View className="pt-4 mt-4 border-t border-dashed border-gray-200">
                <View className="flex-row justify-between">
                  <Text
                    className="text-gray-900"
                    style={{ fontFamily: "WorkSans Regular" }}
                  >
                    Total Amount
                  </Text>
                  {loading ? (
                    <ActivityIndicator size="small" color="#2BCC5A" />
                  ) : (
                    <Text
                      className="text-xl text-[#2BCC5A]"
                      style={{ fontFamily: "Unbounded SemiBold" }}
                    >
                      GHS {data?.total?.toFixed(2) || "0.00"}
                    </Text>
                  )}
                </View>
              </View>
            </View>

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
                style={{ fontFamily: "WorkSans Light" }}
              >
                {expanded ? "Show less" : "View cost breakdown"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods Section */}
        <View className="mt-2 bg-white rounded-3xl shadow-xs p-6">
          <Text
            className="text-gray-800 mb-4"
            style={{ fontFamily: "WorkSans Regular" }}
          >
            Choose Payment Method
          </Text>

          <View className="gap-3">
            <TouchableOpacity
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
                  style={{ fontFamily: "WorkSans Medium" }}
                  className={`text-sm ${
                    selectedPayment === "online"
                      ? "text-[#2BCC5A]"
                      : "text-gray-700"
                  }`}
                >
                  Mobile Money
                </Text>
                <Text
                  className="text-gray-500 text-xs text-center"
                  style={{ fontFamily: "WorkSans Light" }}
                >
                  Instant payment via Momo.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!cashOnDeliveryDisabled) {
                  setSelectedPayment("cash");
                } else {
                  Alert.alert(
                    "Cash on Delivery Unavailable",
                    "Cash on delivery is not available for users with insufficient order history. Please use Mobile Money."
                  );
                }
              }}
              className={`flex-1 p-4 rounded-2xl border-hairline ${
                selectedPayment === "cash" && !cashOnDeliveryDisabled
                  ? "border-[#2BCC5A] bg-[#2BCC5A]/10"
                  : "border-gray-200 bg-white"
              }`}
              style={{
                opacity: cashOnDeliveryDisabled ? 0.5 : 1,
              }}
              disabled={cashOnDeliveryDisabled}
            >
              <View className="items-center space-y-2">
                <MaterialIcons
                  name="wallet"
                  size={24}
                  color={
                    selectedPayment === "cash" && !cashOnDeliveryDisabled
                      ? "#2BCC5A"
                      : "#4b5563"
                  }
                />
                <Text
                  style={{ fontFamily: "WorkSans Medium" }}
                  className={`text-sm ${
                    selectedPayment === "cash" && !cashOnDeliveryDisabled
                      ? "text-[#2BCC5A]"
                      : "text-gray-700"
                  }`}
                >
                  Cash on Delivery
                </Text>
                <Text
                  style={{ fontFamily: "WorkSans Light" }}
                  className="text-gray-500 text-xs text-center"
                >
                  Pay when you receive items
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Add special instructions */}
        <View className="bg-white rounded-3xl shadow-xs mt-4 p-6">
          <Text
            className="text-gray-800 mb-4"
            style={{ fontFamily: "WorkSans Regular" }}
          >
            Special Instructions (Optional)
          </Text>
          <Text
            className="text-gray-500 text-xs"
            style={{ fontFamily: "WorkSans Light" }}
          >
            Provide any specific instructions for the delivery to make it more
            convenient for you.
          </Text>
          <View className="mt-4">
            <TextInput
              placeholder="e.g., Leave at the front door or call upon arrival."
              multiline
              numberOfLines={4}
              className="border border-gray-300 rounded-lg p-4 h-20 bg-gray-50 focus:border-[#2BCC5A] focus:bg-white"
              style={{
                fontFamily: "WorkSans Light",
                textAlignVertical: "top",
              }}
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <Text
            className="text-gray-400 text-xs mt-2"
            style={{ fontFamily: "WorkSans Light" }}
          >
            Keep it short and clear (max 200 characters).
          </Text>
        </View>
        {totalError && (
          <View className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mt-4">
            <View className="flex-row items-center">
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text
                className="text-red-700 text-sm ml-2 flex-1"
                style={{ fontFamily: "WorkSans Regular" }}
              >
                {totalError}
              </Text>
            </View>
            <TouchableOpacity
              onPress={fetchTotal}
              className="mt-3 bg-red-500/10 py-2 px-4 rounded-full self-start"
            >
              <Text
                className="text-red-600 text-xs"
                style={{ fontFamily: "WorkSans Medium" }}
              >
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View className="bg-white pt-4 p-4 border-t border-gray-100">
        <TouchableOpacity
          onPress={handlePayment}
          className={`w-full py-5 rounded-full ${
            loading ? "bg-gray-400" : "bg-[#2BCC5A]"
          } flex-row items-center justify-center space-x-2`}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              className="text-white text-xs"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              Continue to order
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Payment;
