import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useCallback } from "react";
import { router, Stack, useFocusEffect } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCartStore } from "../store/cartStore";

const CheckoutScreen = () => {
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

  const cart = useCartStore((state) => (state as CartState).cart);
  const [coupon, setCoupon] = useState("");
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const [couponDetails, setCouponDetails] = useState<{
    valid: boolean;
    discount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasAddress, setHasAddress] = useState(false);
  const [addressDetails, setAddressDetails] = useState({
    name: "",
    country: "",
    address: "",
    phone: "",
  });

  // Address refresh fix
  useFocusEffect(
    useCallback(() => {
      const loadAddress = async () => {
        try {
          const details = await AsyncStorage.getItem("@deliveryAddress");
          if (details) {
            const { name, country, address, phone } = JSON.parse(details);
            setAddressDetails({ name, country, address, phone });
            setHasAddress(!!name && !!country && !!address && !!phone);
          }
        } catch (error) {
          console.log(error);
        }
      };
      loadAddress();
    }, [])
  );

  const handleCouponApply = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://192.168.43.155:3000/api/verify-coupon",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ promoCode: coupon }),
        }
      );

      const data = await response.json();
      if (data.valid) {
        setCouponDetails(data);
      } else {
        Alert.alert("Invalid Coupon", "The coupon entered is invalid");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleCouponRemove = () => {
    setCouponDetails(null);
    setCoupon("");
  };

  const handleProceedToPayment = () => {
    if (!hasAddress) {
      Alert.alert("Missing Address", "Please add a delivery address first");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/screens/payment");
    }, 1000);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          <ScrollView className="flex-1 px-3">
            <Stack.Screen
              options={{
                headerTitleAlign: "center",
                title: "Checkout",
                headerShadowVisible: false,
                headerTitleStyle: {
                  fontFamily: "Unbounded Regular",
                  fontSize: 14,
                },
              }}
            />

            {/* Delivery Address Section */}
            <Text
              className="text-xs text-gray-500 mt-2 mb-2"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Details
            </Text>

            <Pressable
              className="bg-white p-3 border-hairline border-gray-200 mb-4 rounded-xl"
              onPress={() => router.push("/screens/delivery_address")}
            >
              {hasAddress ? (
                <>
                  <View className="flex-row items-center gap-2 mb-2">
                    <MaterialIcons
                      name="location-on"
                      size={20}
                      color="#2BCC5A"
                    />
                    <Text
                      className="text-xs text-gray-500"
                      style={{ fontFamily: "Unbounded Regular" }}
                    >
                      Delivery Address
                    </Text>
                  </View>
                  <View className="ml-2">
                    <Text
                      className="text-sm text-gray-600 mb-1"
                      style={{ fontFamily: "Unbounded Regular" }}
                    >
                      {addressDetails.name}
                    </Text>
                    <Text
                      className="text-sm text-gray-600 mb-1"
                      style={{ fontFamily: "Unbounded Regular" }}
                    >
                      {addressDetails.country}
                    </Text>
                    <Text
                      className="text-sm text-gray-600 mb-1"
                      style={{ fontFamily: "Unbounded Regular" }}
                    >
                      {addressDetails.address}
                    </Text>
                    <Text
                      className="text-sm text-gray-600"
                      style={{ fontFamily: "Unbounded Regular" }}
                    >
                      {addressDetails.phone
                        ? `+233 ${formatPhoneNumber(addressDetails.phone)}`
                        : ""}
                    </Text>
                  </View>
                </>
              ) : (
                <View className="flex-row items-center justify-between">
                  <Text
                    className="text-gray-500 text-sm"
                    style={{ fontFamily: "Unbounded Regular" }}
                  >
                    Add delivery details
                  </Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#9ca3af"
                  />
                </View>
              )}
            </Pressable>

            {/* Coupon Section */}
            <Text
              className="text-xs text-gray-500 mt-2 mb-2"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Have Coupon?
            </Text>

            <View className="bg-white p-3 border-hairline border-gray-200 mb-4 rounded-xl">
              <View className="flex-row items-center">
                <FloatingLabelInput
                  label="Enter Coupon Code"
                  value={coupon}
                  onChangeText={setCoupon}
                  labelStyles={{
                    fontFamily: "Unbounded Light",
                    color: "#e5e7eb",
                    paddingHorizontal: 3,
                    fontSize: 12,
                  }}
                  inputStyles={{
                    fontFamily: "Unbounded Regular",
                    color: "#4b5563",
                    fontSize: 13,
                  }}
                  customLabelStyles={{
                    colorFocused: "#9ca3af",
                    topFocused: -18,
                    leftFocused: Platform.OS === "ios" ? 15 : 10,
                  }}
                  hint="ex: FREESHIPPING15"
                  hintTextColor="#9ca3af"
                  containerStyles={{
                    flex: 1,
                    paddingLeft: Platform.OS === "ios" ? 15 : 0,
                  }}
                />
                {coupon.length > 0 && (
                  <Pressable
                    className="bg-[#2BCC5A] absolute right-2 px-4 py-2 rounded-full ml-2"
                    onPress={
                      couponDetails ? handleCouponRemove : handleCouponApply
                    }
                    disabled={loading}
                  >
                    <Text
                      className="text-white text-xs"
                      style={{ fontFamily: "Unbounded SemiBold" }}
                    >
                      {couponDetails ? "Remove" : "Apply"}
                    </Text>
                  </Pressable>
                )}
              </View>

              {couponDetails?.valid && (
                <View className="bg-green-100 p-3 mt-2 rounded-xl flex-row items-center justify-between">
                  <Text
                    className="text-green-800 text-xs"
                    style={{ fontFamily: "Unbounded Medium" }}
                  >
                    {coupon} applied. {couponDetails?.discount}% off
                  </Text>
                  <Pressable onPress={handleCouponRemove}>
                    <MaterialIcons name="close" size={16} color="#166534" />
                  </Pressable>
                </View>
              )}
            </View>

            {/* Free Delivery Progress Section */}
            <View className="bg-white p-3 border-hairline border-gray-200 mb-4 rounded-xl">
              <Text
                className="text-xs text-gray-500 mb-2"
                style={{ fontFamily: "Unbounded Regular" }}
              >
                Free Delivery Progress
              </Text>
              <View className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <View
                  className="bg-[#2BCC5A] h-2.5 rounded-full"
                  style={{
                    width: `${(totalPrice / 250) * 100}%`,
                    maxWidth: "100%",
                  }}
                />
              </View>
              {totalPrice >= 250 ? (
                <Text
                  className="text-green-600 text-xs"
                  style={{ fontFamily: "Unbounded Regular" }}
                >
                  Congratulations! You qualify for free delivery.
                </Text>
              ) : (
                <Text
                  className="text-gray-600 text-xs"
                  style={{ fontFamily: "Unbounded Regular" }}
                >
                  Add GHS {(250 - totalPrice).toFixed(2)} more to qualify for
                  free delivery.
                </Text>
              )}
            </View>
          </ScrollView>

          {/* Fixed Bottom Button */}
          <View className="p-3 border-hairline border-gray-200 bg-white">
            <Pressable
              className={`bg-[#2BCC5A] w-full py-5 rounded-full ${
                loading ? "opacity-90" : ""
              }`}
              onPress={handleProceedToPayment}
              disabled={loading || !hasAddress}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text
                  className="text-white text-xs text-center"
                  style={{ fontFamily: "Unbounded SemiBold" }}
                >
                  {hasAddress ? "Continue to Payment" : "Add Address First"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CheckoutScreen;
