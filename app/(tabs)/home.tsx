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
import SwitchComponent from "../components/switch";

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
    description:
      "Enjoy the refreshing taste of our juicy watermelons, perfect for quenching your thirst on a hot Ghanaian day. Packed with vitamins A and C, this sweet fruit is a must-have for your fruit basket.",
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
    description:
      "Crisp and sweet, our apples are perfect for a healthy snack. High in fiber and vitamin C, they are ideal for boosting your immune system and keeping you energized throughout the day.",
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
    description:
      "Rich in potassium, our bananas are perfect for a quick energy boost. Enjoy them on their own or add them to your favorite smoothie for a delicious and nutritious treat.",
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
    description:
      "Experience the tropical sweetness of our papayas. Rich in vitamins C and A, they are perfect for fruit salads, smoothies, or simply enjoying on their own.",
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
    description:
      "Our tomatoes are perfect for adding a burst of flavor to your dishes. Whether in salads, soups, or stews, they are a versatile ingredient rich in antioxidants.",
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
    description:
      "Crunchy and fresh, our cabbages are perfect for salads and cooking. High in vitamins K and C, they are a nutritious addition to any meal.",
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
    description:
      "Add a refreshing crunch to your salads with our fresh lettuce. Low in calories and high in water content, it's perfect for a healthy diet.",
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
    description:
      "Brighten up your dishes with our sweet red peppers. Rich in vitamins A and C, they add a vibrant color and sweet flavor to any meal.",
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
    description:
      "Spice up your meals with our fiery chilli peppers. Perfect for sauces, salsas, and spicy dishes, they are rich in vitamins A and C.",
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
    description:
      "Versatile and nutritious, our green peppers are perfect for a variety of dishes. They are a good source of vitamins A and C, adding both flavor and nutrition to your meals.",
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
    description:
      "Our chicken is a versatile protein that can be grilled, roasted, or fried. It's a staple in many Ghanaian dishes and is a good source of lean protein.",
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
    description:
      "Rich in protein and iron, our beef is perfect for steaks, burgers, and traditional Ghanaian stews. Enjoy the rich flavor and tenderness in every bite.",
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
    description:
      "Our pork is known for its rich flavor and tenderness. Perfect for roasting, grilling, or frying, it's a delicious addition to any meal.",
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
    description:
      "Enjoy the rich, gamey flavor of our mutton. Perfect for traditional stews and curries, it's high in protein and essential nutrients.",
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
    description:
      "Sweet and tangy, our pineapples are perfect for fruit salads, desserts, and as a garnish for drinks. Rich in vitamins C and B6, they are a tropical delight.",
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
    description:
      "Crunchy and sweet, our carrots are perfect for salads and cooking. Rich in beta-carotene, they are a nutritious addition to any meal.",
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
    description:
      "Creamy and rich, our avocados are perfect for salads and guacamole. High in healthy fats, they are a nutritious addition to any meal.",
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
    description:
      "Perfect for soups and stews, our okra is a staple in many Ghanaian dishes. Rich in vitamins C and K, it's a nutritious addition to any meal.",
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
    description:
      "Juicy and sweet, our oranges are perfect for a healthy snack. Rich in vitamin C, they are a delicious way to boost your immune system.",
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
