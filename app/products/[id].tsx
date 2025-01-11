import { View, Text, ActivityIndicator, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useGlobalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import GridcardComponent from "../components/gridcard";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  discount: number;
  unitOfMeasure: string;
  tags: string[];
  imageUrl: string;
}

const DetailsPage = () => {
  const { id } = useGlobalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heartFilled, setHeartFilled] = useState(false);
  const [productsArray, setProductsArray] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setProduct(null); // Reset product state before fetching
      setProductsArray([]); // Reset products array before fetching
      setError(null); // Reset error state before fetching

      try {
        const storedProducts = await AsyncStorage.getItem("@products");
        const productsArray = storedProducts ? JSON.parse(storedProducts) : [];
        if (productsArray.length > 0) {
          setProductsArray(productsArray);
        }

        // Convert id to a number for comparison
        const productId = Number(id);
        const storedProduct = productsArray.find(
          (product: Product) => product.id === productId
        );

        if (storedProduct) {
          console.log("Product found in storage", storedProduct);
          setProduct(storedProduct);
        } else {
          console.log("Product not found in storage");
          setError("Product not found");
        }
      } catch (error) {
        console.error("Failed to fetch product from storage", error);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <View className="flex-1 p-3 bg-white">
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          title: product ? product.name : "Product Details",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Unbounded Regular", fontSize: 14 },
          headerRight: () => (
            <AntDesign
              name={heartFilled ? "heart" : "hearto"}
              size={20}
              color={heartFilled ? "red" : "gray"}
              onPress={() => setHeartFilled(!heartFilled)}
            />
          ),
        }}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2BCC5A"
          className="flex-1 items-center justify-center"
        />
      ) : error ? (
        <Text className="text-red-500 text-center">{error}</Text>
      ) : product ? (
        <ScrollView
          className="flex-1"
          horizontal={false}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1">
            <Image
              source={{ uri: product.imageUrl }}
              className="h-[300px] mt-3 w-full"
              resizeMode="cover"
            />
            <View className="flex-row flex-wrap mt-4">
              {product.tags.map((tag, index) => {
                const colors = [
                  "#FF6347",
                  "#4682B4",
                  "#32CD32",
                  "#FFD700",
                  "#FF69B4",
                  "#8A2BE2",
                  "#5F9EA0",
                  "#D2691E",
                  "#DC143C",
                  "#00FFFF",
                  "#00008B",
                  "#B8860B",
                  "#006400",
                  "#8B008B",
                  "#FF8C00",
                ].sort(() => Math.random() - 0.5);
                const color = colors[index % colors.length];
                const backgroundColor = color + "10"; // Adding transparency

                return (
                  <View
                    key={tag}
                    className="px-3 py-1 mr-2 mb-2 rounded-full"
                    style={{
                      backgroundColor,
                      borderColor: color,
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        color,
                        fontFamily: "Unbounded Light",
                      }}
                      className="text-xs"
                    >
                      {tag}
                    </Text>
                  </View>
                );
              })}
            </View>
            <View className="p-4">
              <View className="flex-row justify-between items-center">
                <Text
                  className="text-black text-xl mb-4"
                  style={{ fontFamily: "Unbounded Regular" }}
                >
                  {product.name}
                </Text>
                <Text
                  className="text-black text-2xl mb-4"
                  style={{ fontFamily: "Unbounded Regular" }}
                >
                  ₵{product.price}
                  <Text className="text-sm text-gray-500">
                    / {product.unitOfMeasure}
                  </Text>
                </Text>
              </View>
              <Text
                className="text-gray-500 text-sm mb-4"
                style={{ fontFamily: "Unbounded Light" }}
              >
                {product.description}
              </Text>
            </View>
            <View className="mt-6">
              <Text
                className="text-gray-500 text-sm mb-4"
                style={{ fontFamily: "Unbounded Light" }}
              >
                Similar Products
              </Text>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                className="mb-10"
              >
                {productsArray
                  .filter(
                    (p: Product) =>
                      p.category === product.category && p.id !== product.id
                  )
                  .slice(0, 4)
                  .map((similarProduct: Product) => (
                    <GridcardComponent
                      key={similarProduct.id}
                      name={similarProduct.name}
                      price={similarProduct.price}
                      unitOfMeasure={similarProduct.unitOfMeasure}
                      imageUrl={similarProduct.imageUrl}
                      productId={similarProduct.id}
                    />
                  ))}
              </ScrollView>
            </View>
            <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200"></View>
          </View>
        </ScrollView>
      ) : (
        <Text className="text-center">404 - Product not found</Text>
      )}
    </View>
  );
};

export default DetailsPage;
