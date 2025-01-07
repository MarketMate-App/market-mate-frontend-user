import {
  View,
  Text,
  Alert,
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderComponent from "../components/header";
import SearchComponent from "../components/search";
import CategoriesComponent from "../components/categories";
import GridcardComponent from "../components/gridcard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { set } from "react-hook-form";

const products = [
  {
    id: 1,
    name: "Watermelon",
    price: 22,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/watermelon.jpg?",
    discount: 10,
    unitOfMeasure: "kg",
    category: "Fruits",
    tags: ["Fruits", "Watermelon", "Red"],
  },
  {
    id: 2,
    name: "Apple",
    price: 5.99,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/apple.jpg?",
    discount: 5,
    unitOfMeasure: "kg",
    category: "Fruits",
    tags: ["Fruits", "Apple", "Red"],
  },
  {
    id: 3,
    name: "Banana",
    price: 54,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/banana.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Banana", "Yellow"],
  },
  {
    id: 4,
    name: "Papaya",
    price: 2.55,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/papaya.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Papaya", "Orange"],
  },
  {
    id: 5,
    name: "Tomato",
    price: 220,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/tomato.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Tomato", "Red"],
  },

  {
    id: 6,
    name: "Cabbage",
    price: 40,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/cabbage.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Cabbage", "Green"],
  },

  {
    id: 7,
    name: "Lettuce",
    price: 22,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/lettuce.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Lettuce", "Green"],
  },
  {
    id: 8,
    name: "Red Pepper",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/red-pepper.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Red Pepper", "Red"],
  },

  {
    id: 9,
    name: "Chilli Pepper",
    price: 42,
    imageUrl:
      "https://ik.imagekit.io/corsa/marketmake/images/chilli-pepper.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Chilli Pepper", "Red"],
  },
  {
    id: 10,
    name: "Green Pepper",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/green-pepper.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Green Pepper", "Green"],
  },
  {
    id: 11,
    name: "Chicken",
    price: 43,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/chicken.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Chicken", "White"],
  },
  {
    id: 12,
    name: "Cow Beef",
    price: 60,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/cow-beef.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Cow Beef", "Red"],
  },
  {
    id: 13,
    name: "Pork",
    price: 77,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/pork.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Pork", "Red"],
  },
  {
    id: 14,
    name: "Mutton",
    price: 28,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/mutton.jpg",
    unitOfMeasure: "lb",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Mutton", "Red"],
  },
  {
    id: 15,
    name: "Pineapple",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/pineapple.jpg",
    discount: 0,
    unitOfMeasure: "piece",
    category: "Fruits",
    tags: ["Fruits", "Citrus", "Fresh"],
  },
  {
    id: 16,
    name: "Carrot",
    price: 8,
    imageUrl: "https://ik.imagekit.io/corsa/images/carrot.jpg",
    discount: 0,
    category: "Vegetables",
    unitOfMeasure: "kg",
    tags: ["Vegetables", "Fresh"],
  },
  {
    id: 17,
    name: "Avocado",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/pear.jpg",
    discount: 0,
    unitOfMeasure: "piece",
    category: "Fruits",
    tags: ["Fruits", "Avocado", "Fresh", "Green", "Pear"],
  },
  {
    id: 18,
    name: "Okra",
    price: 12,
    imageUrl: "https://ik.imagekit.io/corsa/images/okra.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Vegetables",
    tags: ["Vegetables", "Okra", "Green"],
  },
  {
    id: 19,
    name: "Orange",
    price: 7,
    imageUrl: "https://ik.imagekit.io/corsa/images/orange.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Fruits",
    tags: ["Fruits", "Orange", "Citrus"],
  },
];

const HomePage = () => {
  const navigation = useNavigation();
  const [localProducts, setLocalProducts] = useState(products);
  const [loading, setLoading] = useState(true);
  interface Product {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    discount: number;
    unitOfMeasure: string;
    category: string;
    tags: string[];
  }

  const saveToLocalStorage = async (products: Product[]): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(products);
      await AsyncStorage.setItem("@products", jsonValue);
      console.log("Products saved to local storage");
      loadFromLocalStorage();
    } catch (e) {
      console.error("Failed to save products to local storage", e);
    }
  };
  const loadFromLocalStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@products");
      if (jsonValue != null) {
        setLocalProducts(JSON.parse(jsonValue));
        setLoading(false);
      } else {
        setLocalProducts(products);
        setLoading(false);
      }
    } catch (e) {
      console.error("Failed to load products from local storage", e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadFromLocalStorage();
  }, [products]);
  const handleBackPress = () => {
    Alert.alert("Exit", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );

  return (
    <SafeAreaView className="p-2 bg-white flex-1">
      <HeaderComponent />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <CategoriesComponent /> */}
        <Text
          className="text-lg mb-4 text-[#014E3C]"
          style={{ fontFamily: "Unbounded Medium" }}
        >
          Featured Fruits
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {localProducts
            .filter((product) => product.category === "Fruits")
            .map((product) => (
              <GridcardComponent
                productId={product.id}
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                discount={product.discount}
                unitOfMeasure={product.unitOfMeasure}
              />
            ))}
        </ScrollView>
        <Text
          className="text-lg mb-4 text-[#014E3C]"
          style={{ fontFamily: "Unbounded Medium" }}
        >
          Fresh Veggies
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {localProducts
            .filter((product) => product.category === "Vegetables")
            .map((product) => (
              <GridcardComponent
                productId={product.id}
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                discount={product.discount}
                unitOfMeasure={product.unitOfMeasure}
              />
            ))}
        </ScrollView>
        <Text
          className="text-lg mb-4 text-[#014E3C]"
          style={{ fontFamily: "Unbounded Medium" }}
        >
          Grossing Meats
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {localProducts
            .filter((product) => product.category === "Meats")
            .map((product) => (
              <GridcardComponent
                productId={product.id}
                key={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
                discount={product.discount}
                unitOfMeasure={product.unitOfMeasure}
              />
            ))}
        </ScrollView>

        <CategoriesComponent />
      </ScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "#2BCC5A",
          borderRadius: 50,
          padding: 15,
          elevation: 5,
        }}
        onPress={() => router.push("/screens/scan")}
      >
        <Ionicons name="scan" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HomePage;
