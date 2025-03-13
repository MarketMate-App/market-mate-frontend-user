import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
  Platform,
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
  category?: string;
  tags?: string[];
  productId?: number;
}

const GridcardComponent: React.FC<GridcardProps> = ({
  productId,
  name,
  price,
  imageUrl,
  discount,
  unitOfMeasure,
}) => {
  const [heartFilled, setHeartFilled] = useState(false);
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

  return (
    <View className="p-4 border-hairline border-gray-300 rounded-3xl w-[180px] mr-3">
      <Link href={`/products/${productId}`}>
        <ImageBackground
          source={{ uri: imageUrl }}
          className="h-[100px] w-full mb-4"
          resizeMode="contain"
        >
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 10 }}
            onPress={() => setHeartFilled(!heartFilled)}
            hitSlop={20}
          >
            <Ionicons
              name={heartFilled ? "heart" : "heart-outline"}
              size={20}
              color={heartFilled ? "red" : "gray"}
            />
          </TouchableOpacity>
        </ImageBackground>
      </Link>

      <View>
        <Link href={`/products/${productId}`}>
          <Text
            className="text-black text-base mb-4"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            {name}
          </Text>
        </Link>
        <Text
          className="text-gray-500 text-sm"
          style={{ fontFamily: "Unbounded Light" }}
        >
          1 {unitOfMeasure}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text
            className="text-lg relative"
            style={{ fontFamily: "Unbounded SemiBold" }}
          >
            ₵{Math.floor(price)}
            <Text style={{ fontSize: 12, fontFamily: "Unbounded Regular" }}>
              .{price.toFixed(2).split(".")[1]}
            </Text>
          </Text>
          <View>
            {quantity === 0 ? (
              <TouchableOpacity
                className="p-3 rounded-full bg-[#2BCC5A20]"
                onPress={handleAddToCart}
              >
                <Ionicons name="basket" size={24} color={"#2BCC5A"} />
              </TouchableOpacity>
            ) : (
              <View className="flex-row items-center bg-gray-50 p-2 rounded-full">
                <TouchableOpacity
                  onPress={() => handleQuantityChange(quantity - 1)}
                >
                  <Entypo name="minus" size={24} color={"black"} />
                </TouchableOpacity>
                <Text
                  className="mx-2 text-sm text-gray-600"
                  style={{ fontFamily: "Unbounded Regular" }}
                >
                  {quantity}
                </Text>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(quantity + 1)}
                >
                  <Entypo name="plus" size={24} color={"black"} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        <View className="mt-2">
          <Text
            className="text-gray-500"
            style={{ fontFamily: "Gilroy Medium" }}
          >
            Total: ₵{(price * quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GridcardComponent;
