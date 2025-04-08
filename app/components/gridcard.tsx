import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Dimensions,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../store/cartStore";
import { Link } from "expo-router";

interface GridcardProps {
  name: string;
  price: number;
  imageUrl: string;
  discount?: number;
  unitOfMeasure?: string;
  productId?: string;
  layout?: "vertical" | "horizontal" | "full";
  originRegion?: string;
  isGhanaGrown?: boolean;
  purchasesToday?: number;
}

const GridcardComponent: React.FC<GridcardProps> = ({
  productId,
  name,
  price,
  imageUrl,
  discount,
  unitOfMeasure = "unit",
  layout = "vertical",
  originRegion,
  isGhanaGrown,
  purchasesToday,
}) => {
  const [heartFilled, setHeartFilled] = useState(false);
  const { width: screenWidth } = Dimensions.get("window");

  // Layout configuration
  const isVertical = layout === "vertical";
  const isFull = layout === "full";
  const containerWidth = isFull ? screenWidth - 32 : isVertical ? 180 : 300;
  const imageHeight = isFull ? 200 : isVertical ? 100 : 80;

  const [quantity, setQuantity] = useState(0);

  const cart = useCartStore((state) => (state as { cart: any[] }).cart);
  const addToCart = useCartStore(
    (state) => (state as { addToCart: Function }).addToCart
  );
  const removeFromCart = useCartStore(
    (state) => (state as { removeFromCart: Function }).removeFromCart
  );
  const updateQuantity = useCartStore(
    (state) => (state as { updateQuantity: Function }).updateQuantity
  );

  // Update local quantity based on cart changes
  useEffect(() => {
    const existingProduct = cart.find((item) => item.id === productId);
    setQuantity(existingProduct ? existingProduct.quantity : 0);
  }, [cart, productId]);

  const handleAddToCart = () => {
    const product = {
      id: productId,
      name,
      price,
      imageUrl,
      discount,
      unitOfMeasure,
      quantity: 1,
      total: price,
    };
    addToCart(product);
    setQuantity(1);

    if (Platform.OS === "android") {
      ToastAndroid.show(`Added ${name} to cart`, ToastAndroid.SHORT);
    }
  };

  // Immediately update quantity without any debounce delay
  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity === 0) {
        removeFromCart(productId);
      } else {
        updateQuantity(productId, newQuantity);
      }
      setQuantity(newQuantity);
    },
    [productId, removeFromCart, updateQuantity]
  );

  const renderPriceDisplay = () => (
    <View className={`${isFull ? "text-xl" : "text-lg"} relative`}>
      <Text style={{ fontFamily: "Unbounded SemiBold" }}>
        ₵{Math.floor(price)}
        <Text style={{ fontSize: 12, fontFamily: "Unbounded Regular" }}>
          .{price.toFixed(2).split(".")[1]}
        </Text>
      </Text>
    </View>
  );

  const renderDiscount = () => {
    if (!discount || discount <= 0 || discount >= 100) return null;

    const originalPrice = price / (1 - discount / 100);
    return (
      <Text
        className="text-red-500 text-xs line-through"
        style={{ fontFamily: "Unbounded Light" }}
      >
        ₵{originalPrice.toFixed(2)}
      </Text>
    );
  };

  const renderQuantityControls = () => (
    <View className="flex-row items-center bg-gray-50 p-2 rounded-full">
      <TouchableOpacity onPress={() => handleQuantityChange(quantity - 1)}>
        <Entypo name="minus" size={24} color="black" />
      </TouchableOpacity>
      <Text
        className="mx-2 text-sm text-gray-600"
        style={{ fontFamily: "Unbounded Regular" }}
      >
        {quantity}
      </Text>
      <TouchableOpacity onPress={() => handleQuantityChange(quantity + 1)}>
        <Entypo name="plus" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      className={`p-4 border-hairline w-[48%] border-gray-300 rounded-3xl mr-3 ${
        isVertical ? "flex-col" : "flex-row"
      }`}
      style={{
        width: containerWidth,
        backgroundColor: isFull ? "#f8f8f8" : "white",
      }}
    >
      <Link href={`/products/${productId}`} asChild>
        <ImageBackground
          source={{ uri: imageUrl }}
          className={`${isVertical ? "mb-4" : "mr-4"}`}
          style={{
            height: imageHeight,
            width: isFull ? "100%" : isVertical ? "100%" : 80,
          }}
          resizeMode="contain"
        >
          <View className="absolute top-2 left-2 flex-row">
            {isGhanaGrown && (
              <View className="px-2 py-1 rounded-full mr-2">
                <Text
                  className="text-white text-xs"
                  style={{ fontFamily: "Unbounded Regular" }}
                >
                  🇬🇭
                </Text>
              </View>
            )}
            {originRegion && (
              <View className="bg-[#FFD700] px-2 py-1 rounded-full">
                <Text
                  className="text-black text-xs"
                  style={{ fontFamily: "Unbounded Regular" }}
                >
                  {originRegion}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            className="absolute top-2 right-2"
            onPress={() => setHeartFilled(!heartFilled)}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons
              name={heartFilled ? "heart" : "heart-outline"}
              size={20}
              color={heartFilled ? "red" : "gray"}
            />
          </TouchableOpacity>
        </ImageBackground>
      </Link>

      <View className={`flex-1 ${!isVertical ? "justify-between" : ""}`}>
        <Link href={`/products/${productId}`} asChild>
          <Text
            className={`text-black ${isFull ? "text-lg" : "text-base"} mb-1`}
            style={{ fontFamily: "Unbounded Regular" }}
            numberOfLines={isFull ? 2 : 1}
          >
            {name}
          </Text>
        </Link>

        <Text
          className="text-gray-500 text-sm"
          style={{ fontFamily: "Unbounded Light" }}
        >
          per {unitOfMeasure}
        </Text>

        {purchasesToday && purchasesToday > 10 && (
          <Text
            className="text-gray-500 text-xs mb-1"
            style={{ fontFamily: "Unbounded Light" }}
          >
            {purchasesToday}+ bought today
          </Text>
        )}

        <View className={`${isVertical ? "mt-auto" : ""}`}>
          <View className="flex-row items-center justify-between">
            <View>
              {renderPriceDisplay()}
              {renderDiscount()}
            </View>

            <View>
              {quantity === 0 ? (
                <TouchableOpacity
                  className="p-3 rounded-full bg-[#2BCC5A20]"
                  onPress={handleAddToCart}
                >
                  <Ionicons name="basket" size={24} color="#2BCC5A" />
                </TouchableOpacity>
              ) : (
                renderQuantityControls()
              )}
            </View>
          </View>

          {quantity > 0 && (
            <View className="mt-2">
              <Text
                className="text-gray-500"
                style={{ fontFamily: "Gilroy Medium" }}
              >
                Total: ₵{(price * quantity).toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default React.memo(GridcardComponent);
