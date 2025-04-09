import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import ProductCard from "../components/shopcard";
import HeaderComponent from "../components/header";

const App = () => {
  const [products, setProducts] = useState([]);
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/products`;
  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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

  return (
    <View style={styles.container}>
      <HeaderComponent />
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    flex: 1,
    gap: 5,
    width: "48%",
  },
  image: {
    width: "100%",
    height: 200,
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

export default App;
