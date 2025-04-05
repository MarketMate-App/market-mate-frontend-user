import {
  View,
  Text,
  Alert,
  BackHandler,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderComponent from "../components/header";
import CategoriesComponent from "../components/categories";
import GridcardComponent from "../components/gridcard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";

interface Product {
  _id: number | undefined;
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  discount: number;
  unitOfMeasure: string;
  category: string;
  tags: string[];
}

const HomePage = () => {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Load products from AsyncStorage
  const loadFromLocalStorage = async (): Promise<void> => {
    try {
      const jsonValue = await AsyncStorage.getItem("@products");
      if (jsonValue) {
        setLocalProducts(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load products from local storage", e);
    }
  };

  // Save products to AsyncStorage
  const saveToLocalStorage = async (products: Product[]): Promise<void> => {
    try {
      await AsyncStorage.setItem("@products", JSON.stringify(products));
      console.log("Products saved to local storage");
    } catch (e) {
      console.error("Failed to save products to local storage", e);
    }
  };

  // Fetch products from the API and update local storage and state
  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/products`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Product[] = await response.json();
      if (data && data.length > 0) {
        setLocalProducts(data);
        await saveToLocalStorage(data);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load: get from local storage then fetch new data
  useEffect(() => {
    const initializeProducts = async () => {
      await loadFromLocalStorage();
      await fetchData();
    };
    initializeProducts();
  }, []);

  // Pull-to-refresh handler using the latest fetchData logic
  const onRefresh = useCallback(() => {
    fetchData();
  }, []);

  // Handle Android hardware back button
  const handleBackPress = () => {
    Alert.alert("Exit", "Are you sure you want to exit?", [
      { text: "Cancel", onPress: () => null, style: "cancel" },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [handleBackPress])
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="p-2 bg-white flex-1">
        <HeaderComponent />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={onRefresh} />
          }
        >
          {loading ? (
            <View className="flex-1 justify-center items-center">
              <LottieView
                style={{ width: 100, height: 100 }}
                autoPlay
                loop
                source={require("@/assets/animations/bounce.json")}
              />
            </View>
          ) : (
            <>
              {/* Essential Produce section */}
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className="text-lg text-[#014E3C]"
                  style={{ fontFamily: "Unbounded Medium" }}
                >
                  Essential Produce
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/")}
                  className="text-[#2BCC5A]"
                >
                  <Text
                    style={{ fontFamily: "Unbounded Light" }}
                    className="text-gray-700 text-xs underline"
                  >
                    See More
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                {localProducts
                  .filter((product) =>
                    product.tags.includes("Essential".toLowerCase())
                  )
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 10)
                  .map((product) => (
                    <GridcardComponent
                      key={product._id}
                      productId={product._id}
                      name={product.name}
                      price={product.price}
                      imageUrl={product.imageUrl}
                      discount={product.discount}
                      unitOfMeasure={product.unitOfMeasure}
                      layout="horizontal"
                    />
                  ))}
              </ScrollView>

              {/* Featured Fruits */}
              <Text
                className="text-lg mb-4 text-[#014E3C]"
                style={{ fontFamily: "Unbounded Medium" }}
              >
                Featured Fruits
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                {localProducts &&
                  localProducts
                    .filter(
                      (product) => product.category === "Fruits".toLowerCase()
                    )
                    .map((product) => (
                      <GridcardComponent
                        productId={product._id}
                        key={product._id}
                        name={product.name}
                        price={product.price}
                        imageUrl={product.imageUrl}
                        discount={product.discount}
                        unitOfMeasure={product.unitOfMeasure}
                      />
                    ))}
              </ScrollView>

              {/* Fresh Vegetables */}
              <Text
                className="text-lg mb-4 text-[#014E3C]"
                style={{ fontFamily: "Unbounded Medium" }}
              >
                Fresh Veggies
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                {localProducts
                  .filter(
                    (product) => product.category === "Vegetables".toLowerCase()
                  )
                  .map((product) => (
                    <GridcardComponent
                      productId={product._id}
                      key={product._id}
                      name={product.name}
                      price={product.price}
                      imageUrl={product.imageUrl}
                      discount={product.discount}
                      unitOfMeasure={product.unitOfMeasure}
                    />
                  ))}
              </ScrollView>

              {/* Grossing Meats */}
              <Text
                className="text-lg mb-4 text-[#014E3C]"
                style={{ fontFamily: "Unbounded Medium" }}
              >
                Grossing Meats
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-4"
              >
                {localProducts
                  .filter(
                    (product) => product.category === "Meats".toLowerCase()
                  )
                  .map((product) => (
                    <GridcardComponent
                      productId={product._id}
                      key={product._id}
                      name={product.name}
                      price={product.price}
                      imageUrl={product.imageUrl}
                      discount={product.discount}
                      unitOfMeasure={product.unitOfMeasure}
                    />
                  ))}
              </ScrollView>

              {/* Quick Snacks (morning only) */}
              {new Date().getHours() < 12 && (
                <>
                  <Text
                    className="text-lg mb-4 text-[#014E3C]"
                    style={{ fontFamily: "Unbounded Medium" }}
                  >
                    Quick Snacks
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-4"
                  >
                    {localProducts
                      .filter((product) => product.tags.includes("Nutritious"))
                      .map((product) => (
                        <GridcardComponent
                          productId={product._id}
                          key={product._id}
                          name={product.name}
                          price={product.price}
                          imageUrl={product.imageUrl}
                          discount={product.discount}
                          unitOfMeasure={product.unitOfMeasure}
                        />
                      ))}
                  </ScrollView>
                </>
              )}

              <CategoriesComponent />
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
