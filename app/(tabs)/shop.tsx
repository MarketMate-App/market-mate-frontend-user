import {
  View,
  Text,
  Alert,
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import { Link, useNavigation } from "@react-navigation/native";
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
    tags: ["Fruits", "Watermelon", "Red", "Essential", "Refreshing"],
    description:
      "Enjoy the refreshing taste of our juicy watermelons, perfect for quenching your thirst on a hot day. Packed with vitamins A and C, this sweet fruit is a must-have for family gatherings and celebrations, especially during the summer months.",
  },
  {
    id: 2,
    name: "Pineapple",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/pineapple.jpg",
    discount: 0,
    unitOfMeasure: "piece",
    category: "Fruits",
    tags: ["Fruits", "Citrus", "Fresh", "Essential", "Tropical"],
    description:
      "Sweet and tangy, our pineapples are perfect for fruit salads, desserts, and as a garnish for drinks. Rich in vitamins C and B6, they are a tropical delight that brings a taste of the tropics to your table, often enjoyed during festive occasions.",
  },
  {
    id: 3,
    name: "Banana",
    price: 54,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/banana.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Banana", "Yellow", "Essential", "Energy Boost"],
    description:
      "Rich in potassium, our bananas are perfect for a quick energy boost. Enjoy them on their own or add them to your favorite smoothie for a delicious and nutritious treat. A staple in many African households, they are great for breakfast or as a snack on the go.",
  },
  {
    id: 4,
    name: "Tomato",
    price: 220,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/tomato.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Tomato", "Red", "Essential", "Versatile"],
    description:
      "Our tomatoes are perfect for adding a burst of flavor to your dishes. Whether in stews, jollof rice, or salads, they are a versatile ingredient rich in antioxidants. A key ingredient in many African cuisines, they enhance the taste of your favorite meals.",
  },
  {
    id: 5,
    name: "Onion",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/images/onion.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Vegetables",
    tags: ["Vegetables", "Onion", "Essential", "Flavor Base"],
    description:
      "Add depth to your dishes with our onions. Essential for flavoring soups, stews, and sauces, they are a must-have in every kitchen. Onions are widely used in traditional African recipes, enhancing the overall taste of your meals.",
  },
  {
    id: 6,
    name: "Cabbage",
    price: 40,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/cabbage.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Cabbage", "Green", "Essential", "Nutritious"],
    description:
      "Crunchy and fresh, our cabbages are perfect for salads and cooking. High in vitamins K and C, they are a nutritious addition to any meal. Cabbage is often used in traditional dishes like coleslaw and is a staple in many African diets.",
  },
  {
    id: 7,
    name: "Carrot",
    price: 8,
    imageUrl: "https://ik.imagekit.io/corsa/images/carrot.jpg",
    discount: 0,
    category: "Vegetables",
    unitOfMeasure: "kg",
    tags: ["Vegetables", "Fresh", "Essential", "Crunchy"],
    description:
      "Crunchy and sweet, our carrots are perfect for salads and cooking. Rich in beta-carotene, they are a nutritious addition to any meal. Carrots are often used in traditional stews and are a favorite among children.",
  },
  {
    id: 8,
    name: "Spinach",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/spinach.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Spinach", "Green", "Essential", "Nutritious"],
    description:
      "Packed with vitamins and minerals, our spinach is perfect for salads, smoothies, or cooking. It's a great source of iron and antioxidants, making it a staple in many African dishes, especially in stews and soups.",
  },
  {
    id: 9,
    name: "Red Pepper",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/red-pepper.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Red Pepper", "Red", "Essential", "Flavor Enhancer"],
    description:
      "Brighten up your dishes with our sweet red peppers. Rich in vitamins A and C, they add a vibrant color and sweet flavor to any meal. Perfect for stews, salads, and grilling, they are a favorite in many African recipes.",
  },
  {
    id: 10,
    name: "Chilli Pepper",
    price: 42,
    imageUrl:
      "https://ik.imagekit.io/corsa/marketmake/images/chilli-pepper.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Chilli Pepper", "Red", "Essential", "Spicy"],
    description:
      "Spice up your meals with our fiery chilli peppers. Perfect for sauces, salsas, and spicy dishes, they are rich in vitamins A and C. A must-have for lovers of spicy food, they add depth and heat to traditional African dishes.",
  },
  {
    id: 11,
    name: "Fish (Tilapia)",
    price: 50,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/tilapia.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fish",
    tags: ["Fish", "Tilapia", "Fresh", "Essential", "Protein"],
    description:
      "Our fresh tilapia is a popular choice for grilling, frying, or stewing. Rich in protein and omega-3 fatty acids, it's a healthy addition to your diet. Enjoy it with traditional sides like ugali or rice for a complete meal.",
  },
  {
    id: 12,
    name: "Chicken",
    price: 43,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/chicken.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Chicken", "White", "Essential", "Protein"],
    description:
      "Our chicken is a versatile protein that can be grilled, roasted, or fried. It's a staple in many African dishes and is a good source of lean protein. Perfect for family meals and celebrations, it pairs well with a variety of local sides.",
  },
  {
    id: 13,
    name: "Cow Beef",
    price: 60,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/cow-beef.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Beef", "Red", "Essential", "Rich Flavor"],
    description:
      "Rich in protein and iron, our cow beef is perfect for stews, grills, and traditional dishes. Enjoy the rich flavor and tenderness in every bite, making it a favorite for special occasions and family gatherings.",
  },
  {
    id: 14,
    name: "Goat Meat",
    price: 70,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/goat-meat.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Goat Meat", "Red", "Essential", "Flavorful"],
    description:
      "Our goat meat is tender and flavorful, perfect for traditional stews and barbecues. A favorite in many African cultures, it is often enjoyed during celebrations and family gatherings.",
  },
  {
    id: 15,
    name: "Rice",
    price: 30,
    imageUrl: "https://ik.imagekit.io/corsa/images/rice.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Grains",
    tags: ["Grains", "Rice", "Essential", "Staple"],
    description:
      "Our rice is a versatile staple that pairs well with a variety of dishes. It's a great source of carbohydrates and can be used in countless recipes, making it a must-have in every African kitchen.",
  },
  {
    id: 16,
    name: "Cassava",
    price: 20,
    imageUrl: "https://ik.imagekit.io/corsa/images/cassava.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Cassava", "Essential", "Staple"],
    description:
      "Our cassava is a versatile root vegetable that can be boiled, fried, or made into fufu. A staple in many African diets, it is rich in carbohydrates and provides energy for your day.",
  },
  {
    id: 17,
    name: "Sweet Potato",
    price: 12,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/sweet-potato.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Sweet Potato", "Orange", "Essential", "Nutritious"],
    description:
      "Our sweet potatoes are sweet and nutritious, perfect for baking, mashing, or roasting. They are high in fiber and vitamins, making them a beloved staple in many African households.",
  },
  {
    id: 18,
    name: "Okra",
    price: 12,
    imageUrl: "https://ik.imagekit.io/corsa/images/okra.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Okra", "Green", "Essential", "Staple"],
    description:
      "Perfect for soups and stews, our okra is a staple in many African dishes. Rich in vitamins C and K, it's a nutritious addition to any meal, often used in traditional dishes like gumbo.",
  },
  {
    id: 19,
    name: "Groundnuts (Peanuts)",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/ground-nuts.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Nuts",
    tags: ["Nuts", "Groundnuts", "Essential", "Snack"],
    description:
      "Our groundnuts are rich in protein and healthy fats, perfect for snacking or adding to stews and sauces. A popular ingredient in many African cuisines, they add flavor and nutrition to your meals.",
  },
  {
    id: 20,
    name: "Maize (Corn)",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/images/maize.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Grains",
    tags: ["Grains", "Maize", "Essential", "Staple"],
    description:
      "Our maize is a staple food in many African countries, perfect for making porridge, ugali, or cornmeal. Rich in carbohydrates, it provides energy and is a versatile ingredient in various dishes.",
  },
  {
    id: 21,
    name: "Moringa Leaves",
    price: 25,
    imageUrl: "https://ik.imagekit.io/corsa/images/moringa.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Moringa", "Green", "Essential", "Nutritious"],
    description:
      "Our moringa leaves are packed with nutrients and are perfect for adding to soups, stews, or salads. Known for their health benefits, they are a great addition to any meal, especially in traditional African dishes.",
  },
  {
    id: 22,
    name: "Bitter Leaf",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/bitter-leaf.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Bitter Leaf", "Green", "Essential", "Medicinal"],
    description:
      "Our bitter leaf is a traditional African vegetable known for its unique flavor and health benefits. Often used in soups and stews, it adds a distinct taste and is believed to have medicinal properties.",
  },
  {
    id: 23,
    name: "Pawpaw (Papaya)",
    price: 2.55,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/papaya.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Pawpaw", "Orange", "Essential", "Tropical"],
    description:
      "Experience the tropical sweetness of our pawpaw. Rich in vitamins C and A, it is perfect for fruit salads, smoothies, or simply enjoying on its own. Pawpaw is often used in traditional dishes and is known for its digestive benefits.",
  },
  {
    id: 24,
    name: "Coconut",
    price: 30,
    imageUrl: "https://ik.imagekit.io/corsa/marketmake/images/coconut.jpg",
    unitOfMeasure: "piece",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Coconut", "Tropical", "Essential", "Nutritious"],
    description:
      "Our coconuts are fresh and delicious, perfect for drinking or using in cooking. Rich in healthy fats and electrolytes, they are a staple in many coastal African cuisines, adding flavor and nutrition to your meals.",
  },
  {
    id: 25,
    name: "Sorghum",
    price: 20,
    imageUrl: "https://ik.imagekit.io/corsa/images/sorghum.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Grains",
    tags: ["Grains", "Sorghum", "Essential", "Staple"],
    description:
      "Our sorghum is a versatile grain that can be used to make porridge, bread, or beer. A staple in many African diets, it is rich in nutrients and provides energy for your day.",
  },
  {
    id: 26,
    name: "Yam",
    price: 25,
    imageUrl: "https://ik.imagekit.io/corsa/images/yam.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Yam", "Essential", "Staple"],
    description:
      "Our yams are starchy and delicious, perfect for boiling, frying, or making fufu. A staple in many West African cuisines, they are rich in carbohydrates and provide energy for your meals.",
  },
  {
    id: 27,
    name: "Plantain",
    price: 30,
    imageUrl: "https://ik.imagekit.io/corsa/images/plantain.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Plantain", "Yellow", "Essential", "Versatile"],
    description:
      "Our plantains are versatile and can be used in both savory and sweet dishes. Rich in potassium, they can be fried, boiled, or baked, making them a favorite in many African households. Enjoy them as a side dish or in traditional recipes like plantain fufu.",
  },
  {
    id: 28,
    name: "Bamboo Shoots",
    price: 18,
    imageUrl: "https://ik.imagekit.io/corsa/images/bamboo-shoots.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Bamboo Shoots", "Essential", "Crunchy"],
    description:
      "Our bamboo shoots are tender and crunchy, perfect for adding texture to stir-fries and soups. They are a popular ingredient in various African cuisines, providing a unique flavor and nutritional benefits.",
  },
  {
    id: 29,
    name: "Eggs",
    price: 6,
    imageUrl: "https://ik.imagekit.io/corsa/images/eggs.jpg",
    unitOfMeasure: "dozen",
    discount: 0,
    category: "Dairy",
    tags: ["Dairy", "Eggs", "Essential", "Protein"],
    description:
      "Our eggs are fresh and nutritious, perfect for breakfast, baking, or cooking. Rich in protein and vitamins, they are a versatile ingredient in many African dishes, adding flavor and texture to your meals.",
  },
  {
    id: 30,
    name: "Cucumber",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/cucumber.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Cucumber", "Green", "Essential", "Refreshing"],
    description:
      "Our cucumbers are crisp and refreshing, perfect for salads, sandwiches, or snacking. They are rich in vitamins and minerals, making them a healthy addition to your diet. Cucumbers are often enjoyed during the summer months and are a popular ingredient in many African dishes.",
  },
  {
    id: 31,
    name: "Mango",
    price: 18,
    imageUrl: "https://ik.imagekit.io/corsa/images/mango.jpg",
    unitOfMeasure: "piece",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Mango", "Yellow", "Essential", "Tropical"],
    description:
      "Our mangoes are sweet and juicy, perfect for snacking, smoothies, or desserts. Rich in vitamins A and C, they are a tropical delight that brings a taste of the tropics to your table. Mangoes are often enjoyed during the summer months and are a popular ingredient in many African cuisines.",
  },
  {
    id: 32,
    name: "Apple",
    price: 12,
    imageUrl: "https://ik.imagekit.io/corsa/images/apple.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Fruits",
    tags: ["Fruits", "Apple", "Red", "Essential", "Crunchy"],
    description:
      "Our apples are crisp and sweet, perfect for snacking, baking, or adding to salads. Rich in fiber and vitamins, they are a healthy addition to your diet. Apples are often enjoyed as a snack or dessert and are a popular ingredient in many African recipes.",
  },
  {
    id: 33,
    name: "Pork",
    price: 65,
    imageUrl: "https://ik.imagekit.io/corsa/images/pork.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Pork", "White", "Essential", "Protein"],
    description:
      "Our pork is a versatile protein that can be grilled, roasted, or fried. It's a staple in many African dishes and is a good source of lean protein. Perfect for family meals and celebrations, it pairs well with a variety of local sides.",
  },
  {
    id: 34,
    name: "Turkey",
    price: 70,
    imageUrl: "https://ik.imagekit.io/corsa/images/turkey.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Meats",
    tags: ["Meats", "Turkey", "White", "Essential", "Protein"],
    description:
      "Our turkey is a lean protein that can be roasted, grilled, or fried. It's a popular choice for festive occasions and family gatherings, often enjoyed during holidays like Christmas and Thanksgiving.",
  },
  {
    id: 35,
    name: "Green Pepper",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/green-pepper.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Green Pepper", "Green", "Essential", "Flavorful"],
    description:
      "Add a burst of flavor to your dishes with our green peppers. Rich in vitamins A and C, they are perfect for salads, stir-fries, and grilling. Green peppers are a versatile ingredient in many African recipes, adding color and nutrition to your meals.",
  },
  {
    id: 36,
    name: "Lettuce",
    price: 8,
    imageUrl: "https://ik.imagekit.io/corsa/images/lettuce.jpg",
    unitOfMeasure: "piece",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Lettuce", "Green", "Essential", "Crunchy"],
    description:
      "Our lettuce is crisp and refreshing, perfect for salads, sandwiches, or wraps. Rich in vitamins and minerals, it's a healthy addition to your diet. Lettuce is often enjoyed as a side dish or in traditional African recipes.",
  },
  {
    id: 37,
    name: "Garlic",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/images/garlic.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Garlic", "Essential", "Flavor Enhancer"],
    description:
      "Add flavor to your dishes with our garlic. Essential for seasoning soups, stews, and sauces, it's a must-have in every kitchen. Garlic is widely used in traditional African recipes, enhancing the overall taste of your meals.",
  },
  {
    id: 38,
    name: "Ginger",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/ginger.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Ginger", "Essential", "Flavor Enhancer"],
    description:
      "Add a zing to your dishes with our ginger. Perfect for seasoning soups, stews, and sauces, it's a versatile ingredient in many African cuisines. Ginger is known for its health benefits and is often used in traditional remedies.",
  },
  {
    id: 39,
    name: "Cocoyam",
    price: 20,
    imageUrl: "https://ik.imagekit.io/corsa/images/cocoyam.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Vegetables",
    tags: ["Vegetables", "Cocoyam", "Essential", "Staple"],
    description:
      "Our cocoyams are starchy and delicious, perfect for boiling, frying, or making fufu. A staple in many African diets, they are rich in carbohydrates and provide energy for your meals.",
  },
  {
    id: 40,
    name: "Salt",
    price: 2,
    imageUrl: "https://ik.imagekit.io/corsa/images/salt.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Spices",
    tags: ["Spices", "Salt", "Essential", "Flavor Enhancer"],
    description:
      "Our salt is a versatile seasoning that can be used in a variety of dishes. Essential for enhancing the flavor of your meals, it's a must-have in every kitchen. Salt is often used in traditional African recipes, adding depth and balance to your dishes.",
  },
  {
    id: 41,
    name: "Sugar",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/images/sugar.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Spices",
    tags: ["Spices", "Sugar", "Essential", "Sweetener"],
    description:
      "Our sugar is a sweetener that can be used in baking, cooking, or beverages. Perfect for adding sweetness to your favorite dishes, it's a versatile ingredient in many African recipes. Sugar is often enjoyed in tea, coffee, and desserts.",
  },
  {
    id: 42,
    name: "Palm Oil",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/palmoil.jpg",
    unitOfMeasure: "litre",
    discount: 0,
    category: "Oils",
    tags: ["Oils", "Palm Oil", "Essential", "Cooking Oil"],
    description:
      "Our palm oil is rich and flavorful, perfect for cooking, frying, or seasoning. A staple in many African cuisines, it adds color and depth to your dishes, often used in traditional recipes like jollof rice and soups.",
  },
  {
    id: 43,
    name: "Honey",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/images/honey.jpg",
    unitOfMeasure: "litre",
    discount: 0,
    category: "Sweeteners",
    tags: ["Sweeteners", "Honey", "Essential", "Natural Sweetener"],
    description:
      "Our honey is pure and natural, perfect for sweetening your favorite dishes and beverages. Rich in antioxidants and vitamins, it's a healthy alternative to sugar and can be enjoyed on its own or in recipes.",
  },
  {
    id: 44,
    name: "Palm Nuts",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/palmnuts.jpg",
    unitOfMeasure: "kg",
    discount: 0,
    category: "Nuts",
    tags: ["Nuts", "Palm Nuts", "Essential", "Cooking Ingredient"],
    description:
      "Our palm nuts are perfect for making palm nut soup, a traditional African dish. Rich in flavor and nutrients, they are a popular ingredient in many West African cuisines, adding depth and richness to your meals.",
  },
];

const HomePage = () => {
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
    saveToLocalStorage(products);
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
    <View
      className="p-2 bg-white flex-1"
      style={{ paddingTop: Platform.OS === "ios" ? 50 : 0 }}
    >
      <HeaderComponent />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadFromLocalStorage}
          />
        }
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2BCC5A"
            className="flex-1 items-center justify-center"
          />
        ) : (
          <>
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="text-lg text-[#014E3C] "
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
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {localProducts
                .filter((product) =>
                  ["Essential"].some((tag) => product.tags.includes(tag))
                )
                .sort(() => Math.random() - 0.5) // Randomize the order
                .slice(0, 10) // Limit to 7 products
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

            {new Date().getHours() < 12 && (
              <>
                <Text
                  className="text-lg mb-4 text-[#014E3C]"
                  style={{ fontFamily: "Unbounded Medium" }}
                >
                  Quick Snacks
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  {localProducts
                    .filter((product) =>
                      ["Nutritious"].some((tag) => product.tags.includes(tag))
                    )
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
              </>
            )}
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
          </>
        )}
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
        onPress={() => router.push("/home")}
      >
        <Ionicons name="scan" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
export default HomePage;
