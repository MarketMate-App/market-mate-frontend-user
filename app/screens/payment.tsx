import {
  View,
  Text,
  Platform,
  Image,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { useCartStore } from "../store/cartStore";
import { FloatingLabelInput } from "react-native-floating-label-input";
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
    peakSurCharge: number;
    subtotal: number;
    deliveryDiscounts: number;
  };
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const cart = useCartStore((state) => (state as CartState).cart);
  const [data, setData] = useState<TotalData | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const validatePhone = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    setPhoneError(
      cleaned.length === 9 ? "" : "Please enter a valid 9-digit number"
    );
    return cleaned.length === 9;
  };

  const handlePayment = () => {
    if (location === null) {
      Alert.alert(
        "Location Required",
        "It looks like you haven't set a delivery location. Please update your location for accurate delivery."
      );
      router.push("/location");
      return;
    }
    // Proceed to payment processing
    router.push("/screens/payment_processing");
  };

  const body = {
    isPeakHour: new Date().getHours() >= 14 && new Date().getHours() <= 18,
    distance: 5,
    promoCode: "FREESHIP15",
    items: cart.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  const fetchTotal = () => {
    setLoading(true);
    fetch("http://192.168.43.155:3000/api/calculate-total", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data: TotalData) => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        Alert.alert(
          "Oops!",
          "We couldn't calculate the total. Please try again."
        );
        setLoading(false);
      });
  };

  const fetchLocation = async () => {
    const savedLocation = await SecureStore.getItemAsync("userLocation");
    if (savedLocation) {
      const coordinates = JSON.parse(savedLocation);
      setLocation(coordinates);
    } else {
      setLocation(null);
    }
  };

  useEffect(() => {
    fetchLocation();
    if (cart.length === 0) router.push("/");
    fetchTotal();
  }, []);

  return (
    <>
      <View className="flex-1 bg-white">
        <Stack.Screen
          options={{
            headerTitleAlign: "center",
            title: "Review & Pay",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Unbounded Light", fontSize: 14 },
          }}
        />

        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Uncomment and update phone input if needed */}
          {/*
          <View className="mb-8">
            <FloatingLabelInput
              label="Mobile Number"
              labelStyles={{
                fontFamily: "Unbounded Light",
                color: "#e5e7eb",
                paddingHorizontal: 3,
                fontSize: 12,
              }}
              leftComponent={
                <View className="flex-row items-center gap-2 border border-gray-200 p-2 rounded-xl absolute left-3">
                  <Image
                    source={require("@/assets/images/mtn.png")}
                    className="w-6 h-6 rounded-lg"
                    resizeMode="contain"
                  />
                  <Text className="text-xs text-gray-500" style={{ fontFamily: "Unbounded Light" }}>
                    +233
                  </Text>
                </View>
              }
              inputStyles={{
                fontFamily: "Unbounded Light",
                color: "#4b5563",
                fontSize: 13,
              }}
              value={phone}
              animationDuration={50}
              hintTextColor={"#9ca3af"}
              mask="123 456 7890"
              hint="123 456 7890"
              maskType="phone"
              keyboardType="numeric"
              onChangeText={(v) => {
                setPhone(v);
                if (phoneError) validatePhone(v);
              }}
              onBlur={() => validatePhone(phone)}
              containerStyles={{
                paddingLeft: 100,
                paddingTop: Platform.OS === "ios" ? 20 : 15,
                paddingBottom: Platform.OS === "ios" ? 20 : 15,
              }}
            />
            {phoneError && (
              <View className="flex-row items-center gap-1 mt-2">
                <MaterialIcons name="warning" size={12} color="#ef4444" />
                <Text className="text-red-500 text-xs" style={{ fontFamily: "Unbounded Light" }}>
                  {phoneError}
                </Text>
              </View>
            )}
          </View>
          */}

          <View className="bg-gray-50 rounded-xl p-4">
            <Text
              style={{ fontFamily: "Unbounded Medium" }}
              className="mb-4 text-gray-700 text-lg"
            >
              Review Your Order
            </Text>

            <View className="space-y-4 mb-3">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "Unbounded Light" }}
                >
                  Items ({cart.length})
                </Text>
                <Text
                  className="text-gray-700 text-sm"
                  style={{ fontFamily: "Unbounded Medium" }}
                >
                  GHS {data?.subtotal?.toFixed(2) || "0.00"}
                </Text>
              </View>

              <View className="border-b border-dashed border-gray-300" />

              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="text-gray-500 text-sm"
                      style={{ fontFamily: "Unbounded Light" }}
                    >
                      Delivery Cost
                    </Text>
                    <Ionicons
                      name="information-circle"
                      size={16}
                      color="#6b7280"
                    />
                  </View>
                  <Text
                    className="text-gray-700 text-sm"
                    style={{ fontFamily: "Unbounded Medium" }}
                  >
                    GHS{" "}
                    {(data?.deliveryFee || 0) + (data?.distanceFee || 0)
                      ? (
                          (data?.deliveryFee || 0) + (data?.distanceFee || 0)
                        ).toFixed(2)
                      : "0.00"}
                  </Text>
                </View>

                {data?.peakSurCharge !== undefined && (
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-red-600 text-sm"
                      style={{ fontFamily: "Unbounded Regular" }}
                    >
                      Peak Hour Surcharge (+20%)
                    </Text>
                    <Text
                      className="text-red-600 text-sm"
                      style={{ fontFamily: "Unbounded Medium" }}
                    >
                      GHS {data.peakSurCharge.toFixed(2)}
                    </Text>
                  </View>
                )}

                {data?.deliveryDiscounts !== 0 && (
                  <View className="flex-row justify-between items-center">
                    <Text
                      className="text-green-600 text-sm"
                      style={{ fontFamily: "Unbounded Regular" }}
                    >
                      Delivery Discount
                    </Text>
                    <Text
                      className="text-green-600 text-sm"
                      style={{ fontFamily: "Unbounded Medium" }}
                    >
                      -GHS {data?.deliveryDiscounts?.toFixed(2) || "0.00"}
                    </Text>
                  </View>
                )}
              </View>

              <View className="border-b border-dashed border-gray-300" />

              <View className="flex-row justify-between items-center">
                <Text
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: "Unbounded Light" }}
                >
                  Platform Fee
                </Text>
                <Text
                  className="text-gray-700 text-sm"
                  style={{ fontFamily: "Unbounded Medium" }}
                >
                  GHS {(data?.platformFee || 0).toFixed(2)}
                </Text>
              </View>
            </View>

            <View className="mt-6 items-center bg-[#2BCC5A]/10 p-3 rounded-lg flex-row justify-between">
              <Text
                className="text-[#2BCC5A] text-sm"
                style={{ fontFamily: "Unbounded Light" }}
              >
                Total Amount
              </Text>
              <Text
                className="text-[#2BCC5A] text-lg"
                style={{ fontFamily: "Unbounded Medium" }}
              >
                GHS {data?.total?.toFixed(2) || "0.00"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View className="bg-white border-t border-gray-100 pt-4 px-4 pb-6">
        <Pressable
          className={`w-full py-5 rounded-full border-hairline border-white ${
            loading || phoneError ? "bg-gray-300" : "bg-[#2BCC5A]"
          } items-center justify-center`}
          onPress={handlePayment}
          disabled={loading || !!phoneError}
          android_ripple={{ color: "#229544" }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View className="flex-row items-center gap-2">
              <Text
                style={{ fontFamily: "Unbounded SemiBold" }}
                className="text-white text-xs"
              >
                Confirm & Securely Pay
              </Text>
              <MaterialIcons name="lock" size={16} color="white" />
            </View>
          )}
        </Pressable>

        <Text
          className="text-center text-xs text-gray-500 mt-3"
          style={{ fontFamily: "Unbounded Light" }}
        >
          Your payment information is encrypted and securely processed by
          Hubtel.
        </Text>
      </View>
    </>
  );
};

export default Payment;
