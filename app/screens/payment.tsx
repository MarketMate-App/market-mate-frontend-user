import {
  View,
  Text,
  Platform,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { useCartStore } from "../store/cartStore";
import { FloatingLabelInput } from "react-native-floating-label-input";

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
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const cart = useCartStore((state) => (state as CartState).cart);

  type TotalData = {
    total: number;
    deliveryFee: number;
    platformFee: number;
    distanceFee: number;
    peakSurCharge: number;
    subtotal: number;
    deliveryDiscounts: number;
  };
  const [data, setData] = useState<TotalData | null>(null);

  const fetchTotal = () => {
    console.log("fetching total");

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
    fetch("http://192.168.43.155:3000/api/calculate-total", {
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
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/");
    }
    fetchTotal();
  }, []);

  return (
    <>
      <View className=" flex-1 bg-white">
        <Stack.Screen
          options={{
            headerTitleAlign: "center",
            title: "Payment",
            headerShadowVisible: false,
            headerTitleStyle: {
              fontFamily: "Unbounded Regular",
              fontSize: 14,
            },
          }}
        />
        <View className="flex-1 p-3">
          <View className="border border-gray-200 rounded-xl w-full">
            <FloatingLabelInput
              label="Phone"
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
                    style={{ fontFamily: "Unbounded Regular" }}
                  >
                    +233
                  </Text>
                </View>
              }
              inputStyles={{
                fontFamily: "Unbounded Regular",
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
              onChangeText={(value) => setPhone(value)}
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

          <View className="flex-row items-center justify-between mt-4 absolute bottom-0">
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Order Summary
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-4">
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Delivery Fees
            </Text>
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              GHS{" "}
              {(data?.deliveryFee ?? 0) +
                (data?.distanceFee ?? 0) +
                (data?.peakSurCharge ?? 0)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between mt-4">
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Subtotal of items (GHS)
            </Text>
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              GHS {data?.subtotal ?? 0}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-4">
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Platform Fees (GHS)
            </Text>
            <Text
              className="text-xs text-gray-500"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              GHS {(data?.platformFee ?? 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{ paddingBottom: Platform.OS === "ios" ? 20 : 12 }}
        className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-0 left-0 right-0"
      >
        <Pressable
          className="bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text
              className="text-white text-xs text-center"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              Pay GHS {data?.total ?? 0}
            </Text>
          )}
        </Pressable>
      </View>
    </>
  );
};

export default Payment;
