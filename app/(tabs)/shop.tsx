import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import ProductCard from "../components/shopcard";
import HeaderComponent from "../components/header";

// Utility function for seeded randomization
const seededShuffle = (array: any, seed: number) => {
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const App = () => {
  const [products, setProducts] = useState<
    {
      _id: string;
      name: string;
      price: number;
      imageUrl: string;
      discount: number;
      unitOfMeasure: string;
    }[]
  >([]);
  const url = `${process.env.EXPO_PUBLIC_API_URL}/api/products`;

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const seed = 8987; // Replace with your desired seed value
        const shuffledData = seededShuffle(data, seed);
        setProducts(shuffledData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const renderItem = ({
    item,
  }: {
    item: {
      _id: string;
      name: string;
      price: number;
      imageUrl: string;
      discount: number;
      unitOfMeasure: string;
    };
  }) => (
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
    backgroundColor: "#ffffff50",
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
