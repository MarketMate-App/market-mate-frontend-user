// components/ProductCard.js
import { Entypo } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface Product {
  id: number;
  imageUrl: string;
  name: string;
  price: number;
  unitOfMeasure: string;
}

const handleQuantityChange = (product: Product, increment: boolean) => {
  // Implement the logic to handle quantity change
  console.log(`Product: ${product.name}, Increment: ${increment}`);
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <View key={product.id} className="flex-row items-center justify-between">
      <Link
        href={`/products/${product.id}`}
        className="flex-row items-center justify-center gap-4"
      >
        <Image
          source={{ uri: product.imageUrl }}
          className="w-24 h-24"
          resizeMode="contain"
        />
        <View>
          <Text
            className="text-sm text-gray-700 mb-2"
            style={{ fontFamily: "Unbounded Medium" }}
          >
            {product.name}
          </Text>
          <Text
            className="text-gray-500 text-xs mb-4"
            style={{ fontFamily: "Unbounded Light" }}
          >
            1 {product.unitOfMeasure}
          </Text>
        </View>
      </Link>
      <View className="items-center justify-between">
        <Text
          className="text-sm relative mb-2 text-gray-700"
          style={{ fontFamily: "Unbounded Regular" }}
        >
          ₵{Math.floor(product.price)}.{product.price.toFixed(2).split(".")[1]}
        </Text>
      </View>
    </View>
  );
};

export default ProductCard;
