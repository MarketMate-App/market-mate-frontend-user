import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useGlobalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
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
  const [quantity, setQuantity] = useState(0);

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
        <>
          <ScrollView
            className="flex-1"
            horizontal={false}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 mb-10">
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
                  ];
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
                      /{product.unitOfMeasure}
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
                  You may also like
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
            </View>
          </ScrollView>
          <View className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-0 left-0 right-0">
            {quantity === 0 ? (
              <Pressable
                className="px-6 flex-1 py-4 rounded-full border-hairline border-gray-300 flex-row items-center justify-center gap-4"
                onPress={() => setQuantity(1)}
              >
                <Ionicons name="basket-outline" size={24} color={"black"} />
                <Text
                  style={{ fontFamily: "Unbounded Regular" }}
                  className="text-xs text-black"
                >
                  Add to cart
                </Text>
              </Pressable>
            ) : (
              <View className="items-center justify-center flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Pressable
                    className="px-4 py-2 rounded-full border-hairline border-gray-300"
                    onPress={() => setQuantity(quantity - 1)}
                  >
                    <Ionicons name="remove" size={24} color={"black"} />
                  </Pressable>
                  <Text
                    style={{ fontFamily: "Unbounded Regular" }}
                    className="text-lg text-black"
                  >
                    {quantity}
                  </Text>
                  <Pressable
                    className="px-4 py-2 rounded-full border-hairline border-gray-200"
                    onPress={() => setQuantity(quantity + 1)}
                  >
                    <Ionicons name="add" size={24} color={"black"} />
                  </Pressable>
                </View>
                <Text>
                  <Text
                    style={{ fontFamily: "Unbounded Regular" }}
                    className="text-xs text-black"
                  >
                    Total:{" "}
                  </Text>
                  <Text
                    style={{ fontFamily: "Unbounded Regular" }}
                    className="text-xs text-black"
                  >
                    ₵{(product.price * quantity).toFixed(2)}
                  </Text>
                </Text>
              </View>
            )}

            <Pressable className="px-6 flex-1 py-5 rounded-full bg-[#2BCC5A] flex-row items-center justify-center ">
              <Text
                style={{ fontFamily: "Unbounded Regular" }}
                className="text-xs text-white"
              >
                Buy now
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text className="text-center">404 - Product not found</Text>
      )}
    </View>
  );
};

export default DetailsPage;
