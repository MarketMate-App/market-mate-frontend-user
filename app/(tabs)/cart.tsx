import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  Alert,
  ScrollView,
  Pressable,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useCartStore } from "../store/cartStore";
import { router, useFocusEffect } from "expo-router";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { FloatingLabelInput } from "react-native-floating-label-input";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  updateQuantity: (id: number, newQuantity: number) => void;
};

const CartItemComponent = memo(
  ({
    item,
    onUpdateQuantity,
    onRemove,
  }: {
    item: CartItem;
    onUpdateQuantity: (id: number, increment: boolean) => void;
    onRemove: (id: number) => void;
  }) => {
    const handleDecrement = useCallback(() => {
      if (item.quantity > 1) {
        onUpdateQuantity(item.id, false);
      } else {
        onRemove(item.id);
      }
    }, [item, onUpdateQuantity, onRemove]);

    const handleIncrement = useCallback(() => {
      onUpdateQuantity(item.id, true);
    }, [item, onUpdateQuantity]);

    const formattedPrice = `${Math.floor(item.price)}.${
      item.price.toFixed(2).split(".")[1]
    }`;

    return (
      <View
        key={item.id}
        className="flex-row items-center justify-between mb-3"
      >
        <View className="flex-row items-center justify-center gap-4">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-24 h-24"
            resizeMode="contain"
          />
          <View>
            <Text
              className="text-sm text-gray-700 mb-2"
              style={{ fontFamily: "Unbounded Medium" }}
            >
              {item.name.length > 10
                ? `${item.name.substring(0, 16)}...`
                : item.name}
            </Text>
            <Text
              className="text-gray-500 text-xs mb-4"
              style={{ fontFamily: "Unbounded Light" }}
            >
              {item.unitOfMeasure}
            </Text>
          </View>
        </View>
        <View className="items-center justify-between">
          <Text
            className="text-sm relative mb-2 text-gray-700"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            ₵{formattedPrice}
          </Text>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={handleDecrement}
              className="border-hairline border-gray-300 rounded-full p-1"
            >
              <Entypo name="minus" size={20} color="gray" />
            </TouchableOpacity>
            <Text
              className="mx-2 text-gray-500 text-sm"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              {item.quantity}
            </Text>
            <TouchableOpacity
              onPress={handleIncrement}
              className="border-hairline border-gray-300 rounded-full p-1 bg-black"
            >
              <Entypo name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
);

const CartComponent = () => {
  const [hasLocation, setHasLocation] = useState(true);
  const [coupon, setCoupon] = useState("");
  const [couponDetails, setCouponDetails] = useState<{
    valid: boolean;
    discount: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const cart = useCartStore((state) => (state as unknown as CartState).cart);
  const removeFromCart = useCartStore(
    (state) => (state as unknown as CartState).removeFromCart
  );
  const clearCart = useCartStore(
    (state) => (state as unknown as CartState).clearCart
  );
  const updateQuantity = useCartStore(
    (state) => (state as unknown as CartState).updateQuantity
  );

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  useFocusEffect(
    useCallback(() => {
      const fetchLocation = async () => {
        try {
          const location = await SecureStore.getItemAsync("userLocation");
          if (location) {
            setHasLocation(true);
            console.log(location);
          } else {
            setHasLocation(false);
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      };
      fetchLocation();
    }, [])
  );

  const handleCouponApply = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/verify-coupon`,
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

  const handleUpdateQuantity = useCallback(
    (id: number, increment: boolean) => {
      const item = cart.find((item) => item.id === id);
      if (!item) return;
      const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
      if (newQuantity > 0) {
        updateQuantity(id, newQuantity);
      } else {
        removeFromCart(id);
      }
    },
    [cart, removeFromCart, updateQuantity]
  );

  const calculateTotal = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleClearCart = () => {
    Alert.alert(
      "Clear Cart",
      "Are you sure you want to remove all items from the cart?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: clearCart },
      ]
    );
  };

  return (
    <>
      <ScrollView className="bg-white flex-1 px-3 mb-20">
        {cart.length > 0 && (
          <>
            <View className="mb-2 bg-white flex-row items-center justify-between sticky top-0 left-0 right-0">
              <Text
                className="text-xs text-gray-500"
                style={{ fontFamily: "Unbounded Medium" }}
              >
                Estimated:{" "}
                <Text className="text-gray-700">₵{calculateTotal()}</Text>
              </Text>
              <Text
                className="text-xs text-gray-500"
                style={{ fontFamily: "Unbounded Light" }}
              >
                <Text className="text-gray-700">{cart.length}</Text> items
              </Text>
            </View>
            <View className="flex-row justify-end mb-4">
              <TouchableOpacity
                className="px-4 py-2 bg-red-500 rounded-full flex-row items-center justify-center"
                onPress={handleClearCart}
              >
                <Entypo
                  name="trash"
                  size={16}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text
                  className="text-white text-xs text-center"
                  style={{ fontFamily: "Unbounded SemiBold" }}
                >
                  Remove all items
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {cart.map((item) => (
          <CartItemComponent
            key={item.id}
            item={item}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={removeFromCart}
          />
        ))}
        {cart.length === 0 && (
          <View className="flex-1 items-center justify-center">
            <Image
              source={require("@/assets/images/empty-cart.png")}
              className="w-64 h-64 mb-8"
            />
            <Text
              className="text-lg text-gray-700 mb-4"
              style={{ fontFamily: "Unbounded Medium" }}
            >
              Your cart is empty
            </Text>
            <Text
              className="text-center w-80 text-gray-500 mb-8 text-xs"
              style={{ fontFamily: "Unbounded Light" }}
            >
              Fill up your cart with fresh groceries and everyday essentials.
              Start shopping now!
            </Text>
            <TouchableOpacity
              className="w-[56%] px-8 py-5 rounded-full border-hairline border-[#014E3C]"
              onPress={() => router.push("/home")}
            >
              <Text
                className="text-[#014E3C] text-xs text-center"
                style={{ fontFamily: "Unbounded SemiBold" }}
              >
                View trending items
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {cart.length > 0 && (
          <View className="mb-4">
            <Text
              className="text-xs text-gray-500 mt-4 mb-2"
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
                  <TouchableOpacity
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
                  </TouchableOpacity>
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
                  <TouchableOpacity onPress={handleCouponRemove}>
                    <MaterialIcons name="close" size={16} color="#166534" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View className="bg-white p-3 border-hairline border-gray-200 mb-4 rounded-xl">
              <Text
                className="text-xs text-gray-500 mb-2"
                style={{ fontFamily: "Unbounded Regular" }}
              >
                Enjoy free delivery in Takoradi
              </Text>
              <View className="w-full bg-gray-200 rounded-full h-2.5 mb-2 overflow-hidden">
                <View
                  className="bg-[#2BCC5A] h-2.5 rounded-full"
                  style={{
                    width: `${(totalPrice / 500) * 100}%`,
                    maxWidth: "100%",
                  }}
                />
              </View>
              {totalPrice >= 500 ? (
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
                  You are just {(500 - totalPrice).toFixed(2)} away from free
                  delivery.
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
      <View className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-0 left-0 right-0">
        <TouchableOpacity
          className={`bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white ${
            cart.length === 0 ? "opacity-50" : ""
          }`}
          onPress={() => {
            if (cart.length > 0) {
              if (hasLocation) {
                router.push("/screens/payment");
              } else {
                router.push("/location");
              }
            }
          }}
          disabled={cart.length === 0}
        >
          <Text
            className="text-white text-xs text-center"
            style={{ fontFamily: "Unbounded SemiBold" }}
          >
            Go to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default CartComponent;
