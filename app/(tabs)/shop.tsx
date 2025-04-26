import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCard from "../components/shopcard";
import LottieView from "lottie-react-native";

import HeaderComponent from "../components/header";

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/products`;

  const fetchProducts = async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      await AsyncStorage.setItem("products", JSON.stringify(data)); // Cache products in local storage
      setProducts(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadProducts = async () => {
    try {
      const cachedProducts = await AsyncStorage.getItem("products");
      if (cachedProducts) {
        setProducts(JSON.parse(cachedProducts));
        setLoading(false);
      } else {
        await fetchProducts();
      }
    } catch (error) {
      console.error("Error loading products from storage:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
  };

  const renderItem = ({ item }) => (
    <ProductCard
      key={item._id}
      name={item.name}
      price={item.price}
      imageUrl={item.imageUrl}
      discount={item.discount}
      unitOfMeasure={item.unitOfMeasure}
      productId={item._id}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          style={{ width: 100, height: 100 }}
          autoPlay
          loop
          source={require("@/assets/animations/bounce.json")}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderComponent />
      <FlatList
        data={products}
        renderItem={renderItem}
        initialNumToRender={10}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#ffffff10",
  },
  productList: {
    paddingBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
