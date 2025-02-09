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

  const validatePhone = (number: string) => {
    const cleaned = number.replace(/\D/g, "");
    setPhoneError(cleaned.length === 9 ? "" : "Invalid phone number");
    return cleaned.length === 9;
  };

  const handlePayment = () => {
    if (!validatePhone(phone)) return;
    setLoading(true);
    router.push("/screens/payment_processing");
  };
  const body = {
    // Calcualte peak hours based on current time of day between 2pm and 6pm
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
        Alert.alert("Error", "Failed to calculate total. Please try again.");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (cart.length === 0) router.push("/");
    fetchTotal();
  }, []);

  return (
    <>
      <View className="flex-1 bg-white">
        <Stack.Screen
          options={{
            headerTitleAlign: "center",
            title: "Payment",
            headerShadowVisible: false,
            headerTitleStyle: { fontFamily: "Unbounded Light", fontSize: 14 },
          }}
        />

        <ScrollView
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Phone Input Section */}
          <View className="mb-8">
            <View className="border-hairline border-gray-100 rounded-xl bg-gray-50">
              <View className="rounded-xl w-full">
                <FloatingLabelInput
                  label="Mobile Number"
                  labelStyles={{
                    fontFamily: "Unbounded Light",
                    color: "#e5e7eb",
                    paddingHorizontal: 3,
                    fontSize: 12,
                  }}
                  leftComponent={
                    <View className="flex-row items-center gap-2 border-hairline border-gray-200 p-2 rounded-xl absolute left-3">
                      <Image
                        source={require("@/assets/images/mtn.png")}
                        className="w-6 h-6 rounded-lg"
                        resizeMode="contain"
                      />
                      <Text
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "Unbounded Light" }}
                      >
                        +233
                      </Text>
                    </View>
                  }
                  inputStyles={{
                    fontFamily: "Unbounded Light",
                    color: "#4b5563",
                    fontSize: 13,
                  }}
                  customLabelStyles={{ colorFocused: "#9ca3af" }}
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
                    borderWidth: 0,
                    borderBottomWidth: 0,
                    borderBottomColor: "#e5e7eb",
                  }}
                  returnKeyType="done"
                />
              </View>
            </View>
            {phoneError && (
              <View className="flex-row items-center gap-1 mt-2">
                <MaterialIcons name="warning" size={12} color="#ef4444" />
                <Text
                  className="text-red-500 text-xs"
                  style={{ fontFamily: "Unbounded Light" }}
                >
                  {phoneError}
                </Text>
              </View>
            )}
          </View>

          {/* Order Summary */}
          <View className="bg-gray-50 rounded-xl p-4">
            <Text
              style={{ fontFamily: "Unbounded Medium" }}
              className=" mb-4 text-gray-700"
            >
              Order Breakdown
            </Text>

            <View className="space-y-4 mb-3">
              <View className="flex-row justify-between">
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

              <View className="border-b border-gray-100" />

              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className="text-gray-500 text-sm"
                      style={{ fontFamily: "Unbounded Light" }}
                    >
                      Delivery
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
                    GHS {(data?.deliveryFee || 0).toFixed(2)}
                  </Text>
                </View>

                {data?.peakSurCharge !== undefined && (
                  <View className="flex-row justify-between">
                    <Text
                      className="text-red-600 text-sm"
                      style={{ fontFamily: "Unbounded Regular" }}
                    >
                      Peak Hours Surcharge (+20%)
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
                  <View className="flex-row justify-between">
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

              <View className="border-b border-gray-100" />

              <View className="flex-row justify-between">
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
                className="text-[#2BCC5A]"
                style={{ fontFamily: "Unbounded Medium" }}
              >
                GHS {data?.total?.toFixed(2) || "0.00"}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Sticky Footer */}
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
                Confirm & Pay
              </Text>
              <Text>
                <MaterialIcons name="lock" size={16} color="white" />
              </Text>
            </View>
          )}
        </Pressable>

        <Text
          className="text-center text-xs text-gray-500 mt-3"
          style={{ fontFamily: "Unbounded Light" }}
        >
          Secure payment processed via Hubtel
        </Text>
      </View>
    </>
  );
};

export default Payment;
