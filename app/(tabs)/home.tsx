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
  Image,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderComponent from "../components/header";
import CategoriesComponent from "../components/categories";
import GridcardComponent from "../components/gridcard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LottieView from "lottie-react-native";
import GuestBanner from "../components/guestbanner";
import * as SecureStore from "expo-secure-store";

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
  const [user, setUser] = useState<{ fullName: string }>({ fullName: "" });
  const fetchUserDetails = async () => {
    try {
      const userDetails = await AsyncStorage.getItem("@userDetails");
      if (userDetails) {
        const parsedDetails = JSON.parse(userDetails);
        setUser({
          fullName: parsedDetails.fullName || "customer",
        });
        console.log("User details fetched:", parsedDetails);
      }
    } catch (error) {
      console.error("Failed to fetch user details from local storage", error);
    }
  };

  const saveUserDetails = async (details: {
    phoneNumber: string;
    fullName: string;
    profilePicture: string;
    address: {
      street: string;
      region: string;
      country: string;
    };
    wishlist: string[];
  }) => {
    try {
      await AsyncStorage.setItem("@userDetails", JSON.stringify(details));
      console.log("User details saved to local storage");
    } catch (error) {
      console.error("Failed to save user details to local storage", error);
    }
  };

  const loadFromLocalStorage = async (): Promise<void> => {
    try {
      const jsonValue = await AsyncStorage.getItem("@products");
      if (jsonValue) {
        const parsedProducts: Product[] = JSON.parse(jsonValue);
        setLocalProducts(parsedProducts);
        console.log("Loaded products from local storage");
      }
    } catch (e) {
      console.error("Failed to load products from local storage", e);
    }
  };

  const saveToLocalStorage = async (products: Product[]): Promise<void> => {
    try {
      await AsyncStorage.setItem("@products", JSON.stringify(products));
      console.log("Products saved to local storage");
    } catch (e) {
      console.error("Failed to save products to local storage", e);
    }
  };

  const fetchData = async (): Promise<void> => {
    setLoading(true);
    try {
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
        console.log("Fetched and updated products from API");
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
      Alert.alert("Error", "Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const syncData = async (): Promise<void> => {
    setLoading(true);
    try {
      const jsonValue = await AsyncStorage.getItem("@products");
      if (jsonValue) {
        console.log("Displaying offline data first...");
        const parsedProducts: Product[] = JSON.parse(jsonValue);
        setLocalProducts(parsedProducts);
      }

      const isConnected = await checkInternetConnection();
      if (isConnected) {
        console.log("Internet connection available, fetching fresh data...");
        await fetchData();
      } else {
        console.log("No internet connection, staying with offline data...");
        Alert.alert(
          "Offline Mode",
          "No internet connection. Displaying offline data."
        );
      }
    } catch (err) {
      console.error("Error during data sync", err);
      Alert.alert("Error", "Failed to sync data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const checkInternetConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch("https://www.google.com", {
        method: "HEAD",
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const initializeProducts = async () => {
      await syncData();
    };
    fetchUserDetails();
    initializeProducts();
  }, []);

  const onRefresh = useCallback(async () => {
    setLoading(true);
    await syncData();
    setLoading(false);
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
          <View className="mb-4">
            {/* Greeting Banner */}
            <View>
              <Text style={{ fontFamily: "Unbounded Regular" }}>
                {(() => {
                  const hour = new Date().getHours();
                  const greeting =
                    hour < 12 ? "Ayekooo" : hour < 18 ? "Akwaaba" : "Welcome";

                  // Ensure user.fullName is a valid string and fallback to "customer" if not
                  const displayName =
                    user?.fullName && typeof user.fullName === "string"
                      ? user.fullName.trim().split(" ")[0] || "customer"
                      : "customer";

                  return `${greeting}, ${displayName}!`;
                })()}
              </Text>
            </View>
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
              {/* Essential Produce section */}
              <View className="flex-row justify-between items-center mb-4">
                <Text
                  className="text-lg text-[#014E3C]"
                  style={{ fontFamily: "Unbounded Medium" }}
                >
                  Top Picks
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
                  .filter((product) => product.tags.includes("essential"))
                  .sort(() => Math.random() - 0.5)
                  .slice(0, 10)
                  .map((product) => (
                    <GridcardComponent
                      key={product._id}
                      productId={product._id ? String(product._id) : undefined}
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
                      (product) => product.category.toLowerCase() === "fruits"
                    )
                    .map((product) => (
                      <GridcardComponent
                        productId={
                          product._id ? String(product._id) : undefined
                        }
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
                    (product) => product.category.toLowerCase() === "vegetables"
                  )
                  .map((product) => (
                    <GridcardComponent
                      productId={product._id ? String(product._id) : undefined}
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
                    (product) => product.category.toLowerCase() === "meats"
                  )
                  .map((product) => (
                    <GridcardComponent
                      productId={product._id ? String(product._id) : undefined}
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
                          productId={
                            product._id ? String(product._id) : undefined
                          }
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
