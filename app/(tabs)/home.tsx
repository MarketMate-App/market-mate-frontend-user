import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  Alert,
  BackHandler,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import HeaderComponent from "../components/header";
import CategoriesComponent from "../components/categories";
import GridcardComponent from "../components/gridcard";
import GuestBanner from "../components/guestbanner";
import Product from "../types/product";

const HomePage = () => {
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ fullName: string }>({ fullName: "" });

  const fetchUserDetails = useCallback(async () => {
    try {
      const userDetails = await AsyncStorage.getItem("@userDetails");
      if (userDetails) {
        const parsedDetails = JSON.parse(userDetails);
        setUser({ fullName: parsedDetails.fullName || "customer" });
      }
    } catch (error) {
      // console.error("Failed to fetch user details", error);
    }
  }, []);

  const loadFromLocalStorage = useCallback(async (): Promise<
    Product[] | null
  > => {
    try {
      const jsonValue = await AsyncStorage.getItem("@products");
      return jsonValue ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // console.error("Failed to load products from local storage", e);
      return null;
    }
  }, []);

  const saveToLocalStorage = useCallback(
    async (products: Product[]): Promise<void> => {
      try {
        await AsyncStorage.setItem("@products", JSON.stringify(products));
      } catch (e) {
        // console.error("Failed to save products to local storage", e);
      }
    },
    []
  );

  const fetchFromAPI = useCallback(async (): Promise<Product[] | null> => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/products`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (err) {
      // console.error("Failed to fetch products from API", err);
      Alert.alert("Error", "Failed to fetch products. Please try again later.");
      return null;
    }
  }, []);

  const initializeProducts = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const localData = await loadFromLocalStorage();
      if (localData?.length) {
        setLocalProducts(localData);
      } else {
        const apiData = await fetchFromAPI();
        if (apiData?.length) {
          setLocalProducts(apiData);
          await saveToLocalStorage(apiData);
        }
      }
    } catch (err) {
      // console.error("Error initializing products", err);
    } finally {
      setLoading(false);
    }
  }, [fetchFromAPI, loadFromLocalStorage, saveToLocalStorage]);

  useEffect(() => {
    fetchUserDetails();
    initializeProducts();
  }, [fetchUserDetails, initializeProducts]);

  const onRefresh = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = await fetchFromAPI();
      if (apiData?.length) {
        setLocalProducts(apiData);
        await saveToLocalStorage(apiData);
      }
    } catch (err) {
      // console.error("Error refreshing products", err);
    } finally {
      setLoading(false);
    }
  }, [fetchFromAPI, saveToLocalStorage]);

  const handleBackPress = useCallback(() => {
    Alert.alert("Exit", "Are you sure you want to exit?", [
      { text: "Cancel", style: "cancel" },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  }, []);

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, [handleBackPress])
  );

  const greetingMessage = useMemo(() => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Ayekooo" : hour < 18 ? "Akwaaba" : "Welcome";
    const displayName = user?.fullName?.trim().split(" ")[0] || "customer";
    return `${greeting}, ${displayName}!`;
  }, [user]);

  const filteredProducts = useMemo(() => {
    const essentials = localProducts.filter((product) =>
      product.tags.includes("vegetables")
    );
    const fruits = localProducts.filter(
      (product) => product.category.toLowerCase() === "fruits"
    );
    const vegetables = localProducts.filter(
      (product) => product.category.toLowerCase() === "vegetables"
    );
    const meats = localProducts.filter(
      (product) => product.category.toLowerCase() === "meats"
    );
    const snacks =
      new Date().getHours() < 12
        ? localProducts.filter((product) => product.tags.includes("Nutritious"))
        : [];
    const discounts = localProducts.filter((product) => product.discount > 0);
    const bundles = localProducts.filter((product) =>
      product.tags.includes("bundle")
    );
    const ghanaianMarket = localProducts.filter((product) =>
      product.tags.includes("ghanaian")
    );
    const beverages = localProducts.filter(
      (product) => product.category.toLowerCase() === "beverages"
    );
    const dairy = localProducts.filter(
      (product) => product.category.toLowerCase() === "dairy"
    );
    const bakery = localProducts.filter(
      (product) => product.category.toLowerCase() === "bakery"
    );
    const seafood = localProducts.filter(
      (product) => product.category.toLowerCase() === "seafood"
    );
    const topRated = localProducts.filter((product) => product.rating >= 4.5);
    const frozenFoods = localProducts.filter(
      (product) => product.category.toLowerCase() === "frozen foods"
    );
    const pantry = localProducts.filter(
      (product) => product.category.toLowerCase() === "pantry"
    );
    const organic = localProducts.filter((product) =>
      product.tags.includes("organic")
    );
    const quickMeals = localProducts.filter((product) =>
      product.tags.includes("quick meal")
    );
    const babyCare = localProducts.filter(
      (product) => product.category.toLowerCase() === "baby care"
    );
    const healthAndWellness = localProducts.filter(
      (product) => product.category.toLowerCase() === "health and wellness"
    );
    const cleaningSupplies = localProducts.filter(
      (product) => product.category.toLowerCase() === "cleaning supplies"
    );
    const petCare = localProducts.filter(
      (product) => product.category.toLowerCase() === "pet care"
    );
    const internationalCuisine = localProducts.filter((product) =>
      product.tags.includes("international")
    );
    const mealBundles = localProducts.filter((product) =>
      product.tags.includes("meal bundle")
    );
    const festiveSpecials = localProducts.filter((product) =>
      product.tags.includes("festive")
    );
    const tubers = localProducts.filter((product) =>
      product.tags.includes("tubers")
    );
    const newArrivals = localProducts.filter((product) =>
      product.tags.includes("new")
    );

    return {
      essentials,
      fruits,
      vegetables,
      meats,
      snacks,
      discounts,
      bundles,
      ghanaianMarket,
      beverages,
      dairy,
      bakery,
      seafood,
      frozenFoods,
      pantry,
      organic,
      quickMeals,
      babyCare,
      healthAndWellness,
      cleaningSupplies,
      petCare,
      internationalCuisine,
      mealBundles,
      festiveSpecials,
      topRated,
      tubers,
      newArrivals,
    };
  }, [localProducts]);

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
          <View className="mb-4">
            <Text style={{ fontFamily: "WorkSans Regular" }}>
              {greetingMessage}
            </Text>
          </View>
          {user.fullName.trim().length === 0 && <GuestBanner />}
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
              {/* <CategoriesComponent /> */}
              {/* Render sections dynamically */}
              {Object.entries(filteredProducts).map(
                ([key, products]) =>
                  products.length > 0 && (
                    <View key={key}>
                      <Text
                        className="text-lg mb-4 text-[#014E3C]"
                        style={{ fontFamily: "WorkSans Medium" }}
                      >
                        {key.charAt(0).toUpperCase() +
                          key.slice(1).replace(/s$/, "")}
                      </Text>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mb-4"
                      >
                        {products.map(
                          (
                            product: {
                              _id: React.Key | null | undefined;
                              name: string;
                              price: number;
                              imageUrl: string;
                              discount: number | undefined;
                              unitOfMeasure: string | undefined;
                            },
                            index: number
                          ) => (
                            <GridcardComponent
                              key={product._id}
                              productId={
                                product._id ? String(product._id) : undefined
                              }
                              name={product.name}
                              price={product.price}
                              imageUrl={product.imageUrl}
                              discount={product.discount}
                              unitOfMeasure={product.unitOfMeasure}
                              layout={
                                products.length % 2 === 0
                                  ? "horizontal"
                                  : "vertical"
                              } // Alternate layout
                            />
                          )
                        )}
                      </ScrollView>
                    </View>
                  )
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
