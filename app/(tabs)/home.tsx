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
    tags: ["Fruits", "Apple", "Red", "Essential", "Snack"],
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
    tags: ["Fruits", "Banana", "Yellow", "Essential", "Energy Boost"],
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
    tags: ["Fruits", "Papaya", "Orange", "Essential", "Tropical"],
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
    tags: ["Vegetables", "Tomato", "Red", "Essential", "Versatile"],
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
    tags: ["Vegetables", "Cabbage", "Green", "Essential", "Nutritious"],
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
    tags: ["Vegetables", "Lettuce", "Green", "Essential", "Salad Base"],
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
    tags: ["Vegetables", "Red Pepper", "Red", "Essential", "Flavor Enhancer"],
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
    tags: ["Vegetables", "Chilli Pepper", "Red", "Essential", "Spicy"],
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
    tags: ["Vegetables", "Green Pepper", "Green", "Essential", "Nutritious"],
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
    tags: ["Meats", "Chicken", "White", "Essential", "Protein"],
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
    tags: ["Meats", "Cow Beef", "Red", "Essential", "Rich Flavor"],
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
    tags: ["Meats", "Pork", "Red", "Essential", "Tender"],
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
    tags: ["Meats", "Mutton", "Red", "Essential", "Gamey"],
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
    tags: ["Fruits", "Citrus", "Fresh", "Essential", "Tropical"],
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
    tags: ["Vegetables", "Fresh", "Essential", "Crunchy"],
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
    tags: ["Fruits", "Avocado", "Fresh", "Green", "Essential"],
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
    tags: ["Vegetables", "Okra", "Green", "Essential", "Staple"],
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
    tags: ["Fruits", "Orange", "Citrus", "Essential", "Snack"],
    description:
      "Juicy and sweet, our oranges are perfect for a healthy snack. Rich in vitamin C, they are a delicious way to boost your immune system.",
  },
  {
    id: 20,
    name: "Potato",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/potato.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Vegetables",
    tags: ["Vegetables", "Potato", "Brown", "Essential", "Versatile"],
    description:
      "Our potatoes are a kitchen staple, perfect for mashing, frying, or baking. They are rich in carbohydrates and provide energy for your day.",
  },
  {
    id: 21,
    name: "Onion",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/images/onion.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Vegetables",
    tags: ["Vegetables", "Onion", "Essential", "Flavor Base"],
    description:
      "Add depth to your dishes with our onions. They are essential for flavoring soups, stews, and sauces, making them a must-have in every kitchen.",
  },
  {
    id: 22,
    name: "Garlic",
    price: 3,
    imageUrl: "https://ik.imagekit.io/corsa/images/garlic.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Vegetables",
    tags: ["Vegetables", "Garlic", "Essential", "Flavor Enhancer"],
    description:
      "Our garlic adds a robust flavor to your meals. It's a key ingredient in many dishes and is known for its health benefits.",
  },
  {
    id: 23,
    name: "Ginger",
    price: 4,
    imageUrl: "https://ik.imagekit.io/corsa/images/ginger.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Vegetables",
    tags: ["Vegetables", "Ginger", "Essential", "Spice"],
    description:
      "Fresh ginger adds a zesty kick to your dishes. It's perfect for stir-fries, teas, and marinades, and is known for its medicinal properties.",
  },
  {
    id: 24,
    name: "Rice",
    price: 30,
    imageUrl: "https://ik.imagekit.io/corsa/images/rice.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Grains",
    tags: ["Grains", "Rice", "Essential", "Staple"],
    description:
      "Our rice is a versatile staple that pairs well with a variety of dishes. It's a great source of carbohydrates and can be used in countless recipes.",
  },
  {
    id: 25,
    name: "Pasta",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/images/pasta.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Grains",
    tags: ["Grains", "Pasta", "Essential", "Quick Meal"],
    description:
      "Quick and easy to prepare, our pasta is perfect for busy weeknights. Pair it with your favorite sauce for a delicious meal.",
  },
  {
    id: 26,
    name: "Bread",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/bread.jpg",
    discount: 0,
    unitOfMeasure: "loaf",
    category: "Bakery",
    tags: ["Bakery", "Bread", "Essential", "Breakfast"],
    description:
      "Freshly baked bread is a staple for breakfast or sandwiches. Soft and delicious, it's perfect for toasting or enjoying with spreads.",
  },
  {
    id: 27,
    name: "Milk",
    price: 12,
    imageUrl: "https://ik.imagekit.io/corsa/images/milk.jpg",
    discount: 0,
    unitOfMeasure: "litre",
    category: "Dairy",
    tags: ["Dairy", "Milk", "Essential", "Calcium"],
    description:
      "Our fresh milk is rich in calcium and perfect for drinking, cooking, or adding to your coffee. A must-have for every household.",
  },
  {
    id: 28,
    name: "Yogurt",
    price: 8,
    imageUrl: "https://ik.imagekit.io/corsa/images/yogurt.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Dairy",
    tags: ["Dairy", "Yogurt", "Essential", "Snack"],
    description:
      "Creamy and delicious, our yogurt is perfect for a healthy snack or breakfast. Rich in probiotics, it's great for digestion.",
  },
  {
    id: 29,
    name: "Cheese",
    price: 20,
    imageUrl: "https://ik.imagekit.io/corsa/images/cheese.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Dairy",
    tags: ["Dairy", "Cheese", "Essential", "Flavor"],
    description:
      "Our cheese adds a rich flavor to your dishes. Perfect for sandwiches, salads, or as a snack on its own.",
  },
  {
    id: 30,
    name: "Eggs",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/eggs.jpg",
    discount: 0,
    unitOfMeasure: "dozen",
    category: "Dairy",
    tags: ["Dairy", "Eggs", "Essential", "Protein"],
    description:
      "Fresh eggs are a versatile ingredient for breakfast, baking, or cooking. Packed with protein, they are a nutritious choice.",
  },
  {
    id: 31,
    name: "Sugar",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/images/sugar.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Baking",
    tags: ["Baking", "Sugar", "Essential", "Sweetener"],
    description:
      "Our sugar is perfect for sweetening your beverages and baking. A kitchen essential for all your cooking needs.",
  },
  {
    id: 32,
    name: "Salt",
    price: 2,
    imageUrl: "https://ik.imagekit.io/corsa/images/salt.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Baking",
    tags: ["Baking", "Salt", "Essential", "Flavor Enhancer"],
    description:
      "Essential for cooking, our salt enhances the flavor of your dishes. A must-have in every kitchen.",
  },
  {
    id: 33,
    name: "Black Pepper",
    price: 4,
    imageUrl: "https://ik.imagekit.io/corsa/images/black-pepper.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Spices",
    tags: ["Spices", "Black Pepper", "Essential", "Seasoning"],
    description:
      "Our black pepper adds a spicy kick to your meals. Perfect for seasoning meats, vegetables, and soups.",
  },
  {
    id: 34,
    name: "Cooking Oil",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/images/cooking-oil.jpg",
    discount: 0,
    unitOfMeasure: "litre",
    category: "Condiments",
    tags: ["Condiments", "Cooking Oil", "Essential", "Frying"],
    description:
      "Our cooking oil is perfect for frying, sautéing, and baking. A versatile ingredient for all your cooking needs.",
  },
  {
    id: 35,
    name: "Soy Sauce",
    price: 6,
    imageUrl: "https://ik.imagekit.io/corsa/images/soy-sauce.jpg",
    discount: 0,
    unitOfMeasure: "litre",
    category: "Condiments",
    tags: ["Condiments", " Soy Sauce", "Essential", "Flavor Enhancer"],
    description:
      "Our soy sauce adds a savory depth to your dishes. Perfect for stir-fries, marinades, and dipping sauces.",
  },
  {
    id: 36,
    name: "Ketchup",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/images/ketchup.jpg",
    discount: 0,
    unitOfMeasure: "litre",
    category: "Condiments",
    tags: ["Condiments", "Ketchup", "Essential", "Topping"],
    description:
      "Our ketchup is a classic condiment that adds sweetness and tang to burgers, fries, and sandwiches.",
  },
  {
    id: 37,
    name: "Mustard",
    price: 4,
    imageUrl: "https://ik.imagekit.io/corsa/images/mustard.jpg",
    discount: 0,
    unitOfMeasure: "litre",
    category: "Condiments",
    tags: ["Condiments", "Mustard", "Essential", "Spicy"],
    description:
      "Our mustard adds a zesty flavor to sandwiches and salads. A must-have for any condiment collection.",
  },
  {
    id: 38,
    name: "Honey",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/honey.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Condiments",
    tags: ["Condiments", "Honey", "Essential", "Natural Sweetener"],
    description:
      "Our honey is a natural sweetener perfect for tea, baking, or drizzling over yogurt and fruits.",
  },
  {
    id: 39,
    name: "Peanut Butter",
    price: 8,
    imageUrl: "https://ik.imagekit.io/corsa/images/peanut-butter.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Condiments",
    tags: ["Condiments", "Peanut Butter", "Essential", "Spread"],
    description:
      "Creamy and delicious, our peanut butter is perfect for spreading on bread or adding to smoothies.",
  },
  {
    id: 40,
    name: "Jam",
    price: 6,
    imageUrl: "https://ik.imagekit.io/corsa/images/jam.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Condiments",
    tags: ["Condiments", "Jam", "Essential", "Spread"],
    description:
      "Our jam is made from fresh fruits and is perfect for spreading on toast or adding to desserts.",
  },
  {
    id: 41,
    name: "Frozen Vegetables",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/frozen-vegetables.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Frozen Foods",
    tags: ["Frozen Foods", "Vegetables", "Essential", "Convenient"],
    description:
      "Our frozen vegetables are a quick and easy way to add nutrition to your meals. Perfect for stir-fries and soups.",
  },
  {
    id: 42,
    name: "Frozen Fruits",
    price: 12,
    imageUrl: "https://ik.imagekit.io/corsa/images/frozen-fruits.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Frozen Foods",
    tags: ["Frozen Foods", "Fruits", "Essential", "Smoothies"],
    description:
      "Our frozen fruits are perfect for smoothies, desserts, or snacking. Convenient and nutritious.",
  },
  {
    id: 43,
    name: "Ice Cream",
    price: 15,
    imageUrl: "https://ik.imagekit.io/corsa/images/ice-cream.jpg",
    discount: 0,
    unitOfMeasure: "litre",
    category: "Frozen Foods",
    tags: ["Frozen Foods", "Ice Cream", "Essential", "Dessert"],
    description:
      "Our ice cream is a delightful treat for any occasion. Available in various flavors, it's perfect for dessert.",
  },
  {
    id: 44,
    name: "Snack Bars",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/images/snack-bars.jpg",
    discount: 0,
    unitOfMeasure: "box",
    category: "Snacks",
    tags: ["Snacks", "Snack Bars", "Essential", "On-the-Go"],
    description:
      "Our snack bars are perfect for a quick and healthy snack. Great for on-the-go energy.",
  },
  {
    id: 45,
    name: "Chips",
    price: 3,
    imageUrl: "https://ik.imagekit.io/corsa/images/chips.jpg",
    discount: 0,
    unitOfMeasure: "bag",
    category: "Snacks",
    tags: ["Snacks", "Chips", "Essential", "Crunchy"],
    description:
      "Our chips are a crunchy and delicious snack, perfect for parties or a quick treat.",
  },
  {
    id: 46,
    name: "Nuts",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/nuts.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Snacks",
    tags: ["Snacks", "Nuts", "Essential", "Healthy"],
    description:
      "Our mixed nuts are a healthy and satisfying snack, packed with protein and healthy fats.",
  },
  {
    id: 47,
    name: "Granola",
    price: 8,
    imageUrl: "https://ik.imagekit.io/corsa/images/granola.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Breakfast",
    tags: ["Breakfast", "Granola", "Essential", "Healthy"],
    description:
      "Our granola is a delicious and nutritious breakfast option, perfect with yogurt or milk.",
  },
  {
    id: 48,
    name: "Oats",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/images/oats.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Breakfast",
    tags: ["Breakfast", "Oats", "Essential", "Fiber"],
    description:
      "Our oats are a wholesome breakfast choice, rich in fiber and perfect for a hearty meal.",
  },
  {
    id: 49,
    name: "Cereal",
    price: 6,
    imageUrl: "https://ik.imagekit.io/corsa/images/cereal.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Breakfast",
    tags: ["Breakfast", "Cereal", "Essential", "Quick"],
    description:
      "Our cereal is a quick and easy breakfast option, perfect for busy mornings.",
  },
  {
    id: 50,
    name: "Tea",
    price: 4,
    imageUrl: "https://ik.imagekit.io/corsa/images/tea.jpg",
    discount: 0,
    unitOfMeasure: "box",
    category: "Beverages",
    tags: ["Beverages", "Tea", "Essential", "Relaxing"],
    description:
      "Our tea is perfect for a relaxing moment. Available in various flavors, it's a soothing beverage.",
  },
  {
    id: 51,
    name: "Coffee",
    price: 10,
    imageUrl: "https://ik.imagekit.io/corsa/images/coffee.jpg",
    discount: 0,
    unitOfMeasure: "kg",
    category: "Beverages",
    tags: ["Beverages", "Coffee", "Essential", "Energizing"],
    description:
      "Our coffee is rich and aromatic, perfect for starting your day or enjoying a break.",
  },
  {
    id: 52,
    name: "Juice",
    price: 5,
    imageUrl: "https://ik.imagekit.io/corsa/images/juice.jpg",
    discount: 0,
    unitOfMeasure: "litre",
    category: "Beverages",
    tags: ["Beverages", "Juice", "Essential", "Refreshing"],
    description:
      "Our juice is made from fresh fruits, providing a refreshing and nutritious drink.",
  },
  {
    id: 53,
    name: "Soda",
    price: 2,
    imageUrl: "https://ik.imagekit.io/corsa/images/soda.jpg",
    discount: 0,
    unitOfMeasure: "litre",
    category: "Beverages",
    tags: ["Beverages", "Soda", "Essential", "Fizzy"],
    description:
      "Our soda is a fizzy and refreshing drink, perfect for parties or a casual gathering.",
  },
  {
    id: 54,
    name: "Sparkling Water",
    price: 3,
    imageUrl: "https://ik.imagekit.io/corsa/images/sparkling-water.jpg",
    discount: 0,
    unitOfMeasure: "litre",
    category: "Beverages",
    tags: ["Beverages", "Sparkling Water", "Essential", "Hydrating"],
    description:
      "Our sparkling water is a refreshing alternative to soda, perfect for hydration.",
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
    <SafeAreaView className="p-2 bg-white flex-1">
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
                Best Deals
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
                  Morning Snacks
                </Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  className="mb-4"
                >
                  {localProducts
                    .filter((product) =>
                      [
                        "Snacks",
                        "Breakfast",
                        "Healthy",
                        "On-The-Go",
                        "Quick",
                      ].some((tag) => product.tags.includes(tag))
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
        onPress={() => router.push("/screens/scan")}
      >
        <Ionicons name="scan" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default HomePage;
