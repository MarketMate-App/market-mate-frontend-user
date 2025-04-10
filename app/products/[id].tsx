import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import GridcardComponent from "../components/gridcard";
import { useCartStore } from "../store/cartStore";

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  discount: number;
  unitOfMeasure: string;
  tags: string[];
  quantity?: number;
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

  const cart = useCartStore(
    (state) => (state as unknown as { cart: Product[] }).cart
  );
  const addToCart = useCartStore(
    (state) => (state as { addToCart: Function }).addToCart
  );
  const removeFromCart = useCartStore(
    (state) => (state as { removeFromCart: Function }).removeFromCart
  );
  const updateQuantity = useCartStore(
    (state) => (state as { updateQuantity: Function }).updateQuantity
  );

  const fetchProduct = async () => {
    setLoading(true);
    setProduct(null);
    setProductsArray([]);
    setError(null);

    try {
      const storedProducts = await AsyncStorage.getItem("@products");
      const productsArray = storedProducts ? JSON.parse(storedProducts) : [];
      if (productsArray.length > 0) {
        setProductsArray(productsArray);
      }

      const productId = id;
      const storedProduct = productsArray.find(
        (product: Product) => product._id === productId
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

  useEffect(() => {
    fetchProduct();
    console.log("Product ID:", id);
  }, [id]);

  useEffect(() => {
    const existingProduct = cart.find((item) => item.id === id);
    if (existingProduct) {
      setQuantity(existingProduct.quantity ?? 0);
    }
  }, [cart, id]);

  const handleAddToCart = () => {
    if (product) {
      const newProduct = {
        ...product,
        quantity: 1,
        total: product.price,
      };
      addToCart(newProduct);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (product) {
      if (newQuantity === 0) {
        removeFromCart(product.id);
      } else {
        updateQuantity(product.id, newQuantity);
      }
      setQuantity(newQuantity);
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchProduct();
  };

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
              size={24}
              color={heartFilled ? "red" : "gray"}
              onPress={() => setHeartFilled(!heartFilled)}
            />
          ),
        }}
      />
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2BCC5A" />
          <Text
            className="mt-4 text-gray-500 text-xs text-center"
            style={{ fontFamily: "Unbounded Light" }}
          >
            Hang tight! We're fetching the product details for you...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <Text
            className="text-red-500 text-center"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Oops! Something went wrong.
          </Text>
          <Text
            className="text-gray-500 text-xs text-center mt-2"
            style={{ fontFamily: "Unbounded Light" }}
          >
            Unable to load product details. Please check your connection and try
            again.
          </Text>
          <TouchableOpacity
            className="mt-6 px-6 py-3 rounded-full bg-[#2BCC5A]"
            onPress={handleRetry}
          >
            <Text
              style={{ fontFamily: "Unbounded Regular" }}
              className="text-xs text-white"
            >
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : product ? (
        <SafeAreaView>
          <ScrollView
            className="flex-1"
            horizontal={false}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 mb-10">
              <Image
                source={{ uri: product.imageUrl }}
                className="h-[300px] mt-3 w-full"
                resizeMode="contain"
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
                  const backgroundColor = color + "10";

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
                        p.category === product.category && p._id !== product._id
                    )
                    .slice(0, 5)
                    .map((similarProduct: Product) => (
                      <GridcardComponent
                        key={similarProduct._id}
                        name={similarProduct.name}
                        price={similarProduct.price}
                        unitOfMeasure={similarProduct.unitOfMeasure}
                        imageUrl={similarProduct.imageUrl}
                        productId={similarProduct._id}
                      />
                    ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
          <View
            className="p-3 border-hairline border-gray-200 bg-white flex-row items-center justify-center gap-2 absolute bottom-10 left-0 right-0"
            style={{ paddingBottom: Platform.OS === "ios" ? 20 : 12 }}
          >
            {quantity === 0 ? (
              <TouchableOpacity
                hitSlop={20}
                className="px-6 flex-1 py-4 rounded-full border-hairline border-gray-300 flex-row items-center justify-center gap-4"
                onPress={handleAddToCart}
              >
                <Ionicons name="basket-outline" size={24} color={"black"} />
                <Text
                  style={{ fontFamily: "Unbounded Regular" }}
                  className="text-xs text-black"
                >
                  Add to cart
                </Text>
              </TouchableOpacity>
            ) : (
              <View className="items-center justify-center flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <TouchableOpacity
                    hitSlop={20}
                    className="px-4 py-2 rounded-full border-hairline border-gray-300"
                    onPress={() => handleQuantityChange(quantity - 1)}
                  >
                    <Ionicons name="remove" size={24} color={"black"} />
                  </TouchableOpacity>
                  <Text
                    style={{ fontFamily: "Unbounded Regular" }}
                    className="text-lg text-black"
                  >
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    hitSlop={20}
                    className="px-4 py-2 rounded-full border-hairline border-gray-200"
                    onPress={() => handleQuantityChange(quantity + 1)}
                  >
                    <Ionicons name="add" size={24} color={"black"} />
                  </TouchableOpacity>
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

            <TouchableOpacity
              hitSlop={20}
              className="px-6 flex-1 py-5 rounded-full bg-[#2BCC5A] flex-row items-center justify-center "
            >
              <Text
                style={{ fontFamily: "Unbounded Regular" }}
                className="text-xs text-white"
              >
                Buy now
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <Text
          className="text-center text-xs text-gray-500 mt-4"
          style={{ fontFamily: "Unbounded SemiBold" }}
        >
          404 - Product not found
        </Text>
      )}
    </View>
  );
};

export default DetailsPage;
