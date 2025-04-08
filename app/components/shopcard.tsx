import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
  Platform,
  Dimensions,
  StyleSheet,
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

const ShopcardComponent: React.FC<GridcardProps> = ({
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

  const isFull = layout === "full";

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
    <View className="relative">
      <Text className="text-2xl" style={{ fontFamily: "Unbounded SemiBold" }}>
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
    <View className="flex-row items-center justify-evenly bg-gray-50 p-3 rounded-full">
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
    <View style={[styles.card, { width: isFull ? "100%" : "48%" }]}>
      <Image
        style={styles.image}
        resizeMode="contain"
        source={{ uri: imageUrl }}
      />
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
        {unitOfMeasure}
      </Text>
      {purchasesToday !== undefined && purchasesToday > 10 && (
        <Text
          className="text-gray-500 text-xs mb-1"
          style={{ fontFamily: "Unbounded Light" }}
        >
          {`${purchasesToday}+ bought today`}
        </Text>
      )}
      {renderPriceDisplay()}
      {renderDiscount()}
      <View className="mt-1">
        {quantity === 0 ? (
          <TouchableOpacity
            className="p-2 rounded-full justify-evenly items-center bg-[#2BCC5A]"
            onPress={handleAddToCart}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <Ionicons name="basket" size={24} color="#fff" />
            <Text
              className="text-xs text-white mt-1"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Grab it now
            </Text>
          </TouchableOpacity>
        ) : (
          renderQuantityControls()
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  productList: {
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    marginRight: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
  },
});
export default React.memo(ShopcardComponent);
