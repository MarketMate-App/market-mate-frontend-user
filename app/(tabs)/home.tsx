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
import React from "react";
import { router, useFocusEffect } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import HeaderComponent from "../components/header";
import SearchComponent from "../components/search";
import CategoriesComponent from "../components/categories";
import GridcardComponent from "../components/gridcard";

const products = [
  {
    id: 1,
    name: "Watermelon",
    price: 22,
    imageUrl: require("../../assets/images/watermelon.jpg"),
    discount: 10,
    unitOfMeasure: "kg",
    category: "Fruits",
    tags: ["Fruits", "Watermelon", "Red"],
  },
  {
    id: 2,
    name: "Apple",
    price: 5.99,
    imageUrl: require("../../assets/images/apple.jpg"),
    discount: 5,
    unitOfMeasure: "kg",
    category: "Fruits",
    tags: ["Fruits", "Apple", "Red"],
  },
  {
    id: 3,
    name: "Banana",
    price: 54,
    imageUrl: require("../../assets/images/banana.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Banana", "Yellow"],
  },
  {
    id: 4,
    name: "Papaya",
    price: 2.55,
    imageUrl: require("../../assets/images/papaya.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Papaya", "Orange"],
  },
  {
    id: 5,
    name: "Tomato",
    price: 220,
    imageUrl: require("../../assets/images/tomato.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Tomato", "Red"],
  },

  {
    id: 6,
    name: "Cabbage",
    price: 40,
    imageUrl: require("../../assets/images/cabbage.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Cabbage", "Green"],
  },

  {
    id: 7,
    name: "Lettuce",
    price: 22,
    imageUrl: require("../../assets/images/lettuce.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Lettuce", "Green"],
  },
  {
    id: 8,
    name: "Red Pepper",
    price: 15,
    imageUrl: require("../../assets/images/redpepper.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Red Pepper", "Red"],
  },

  {
    id: 9,
    name: "Chilli Pepper",
    price: 42,
    imageUrl: require("../../assets/images/chillipepper.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Chilli Pepper", "Red"],
  },
  {
    id: 10,
    name: "Green Pepper",
    price: 5,
    imageUrl: require("../../assets/images/greenpepper.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Green Pepper", "Green"],
  },
  {
    id: 11,
    name: "Chicken",
    price: 43,
    imageUrl: require("../../assets/images/chicken.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Chicken", "White"],
  },
  {
    id: 12,
    name: "Cow Beef",
    price: 60,
    imageUrl: require("../../assets/images/beef.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Cow Beef", "Red"],
  },
  {
    id: 13,
    name: "Pork",
    price: 77,
    imageUrl: require("../../assets/images/pork.jpg"),
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Pork", "Red"],
  },
  {
    id: 14,
    name: "Mutton",
    price: 28,
    imageUrl: require("../../assets/images/mutton.jpg"),
    unitOfMeasure: "lb",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Mutton", "Red"],
  },
];

const HomePage = () => {
  const navigation = useNavigation();

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
    <SafeAreaView className="p-3 bg-white flex-1">
      <HeaderComponent />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <CategoriesComponent /> */}
        <Text
          className="text-xl mb-4 text-green-900"
          style={{ fontFamily: "Gilroy Bold" }}
        >
          Featured Fruits
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {products
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
          className="text-xl mb-4 text-green-900"
          style={{ fontFamily: "Gilroy Bold" }}
        >
          Fresh Veggies
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {products
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
          className="text-xl mb-4 text-green-900"
          style={{ fontFamily: "Gilroy Bold" }}
        >
          Grossing Meats
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {products
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
          backgroundColor: "green",
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
