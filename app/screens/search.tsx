import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import ProductCard from "../components/productcard"; // Import the ProductCard component
import AsyncStorage from "@react-native-async-storage/async-storage";

const SearchScreen = () => {
  const categories = [
    "all", // Add "all" category
    "fruits",
    "vegetables",
    "meats",
    "fish",
    "dairy",
    "bakery",
    "beverages",
    "snacks",
    "frozen",
    "canned",
    "cleaning",
    "personal care",
    "baby",
    "pets",
  ];

  interface Product {
    id: number;
    name: string;
    category: string;
    imageUrl: string;
    price: number;
    unitOfMeasure: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // Default to "all"
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem("@products");
      if (storedProducts) {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
        setFilteredProducts(parsedProducts); // Initially show all products
      }
    } catch (error) {
      console.error("Failed to load products from AsyncStorage", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem("@recentSearches");
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error("Failed to load recent searches", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchRecentSearches();
  }, []);

  useEffect(() => {
    let updatedProducts = products;

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      updatedProducts = updatedProducts.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      updatedProducts = updatedProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(updatedProducts);
  }, [searchQuery, selectedCategory, products]);

  const handleSearch = async () => {
    if (searchQuery) {
      // Save the search query if it's not already in the recent searches
      if (!recentSearches.includes(searchQuery)) {
        const updatedSearches = [...recentSearches, searchQuery];
        setRecentSearches(updatedSearches);
        await AsyncStorage.setItem(
          "@recentSearches",
          JSON.stringify(updatedSearches)
        );
      }
      // Perform the search
      setSearchQuery(searchQuery);
    }
  };

  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
    handleSearch(); // Call handleSearch to update recent searches
  };

  const removeRecentSearch = async (query: string) => {
    const updatedSearches = recentSearches.filter((search) => search !== query);
    setRecentSearches(updatedSearches);
    await AsyncStorage.setItem(
      "@recentSearches",
      JSON.stringify(updatedSearches)
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts().then(() => setRefreshing(false));
  }, []);

  return (
    <View className="bg-gray-50 py-1 px-3 flex-1">
      <View className="flex flex-row items-center bg-gray-200 rounded-full px-4 py-2 mb-2 sticky top-1">
        <Feather name="search" size={20} color="gray" className="mr-2" />
        <TextInput
          placeholder="Search MarketMate"
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ fontFamily: "Unbounded Regular" }}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery("")} className="ml-2">
            <Feather name="x-circle" size={20} color="gray" />
          </Pressable>
        )}
        <Pressable onPress={handleSearch} className="ml-2">
          <Text
            className="text-green-900 text-xs"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Search
          </Text>
        </Pressable>
      </View>

      {/* Recent Searches Section */}
      {recentSearches.length > 0 && (
        <View className="mb-4">
          <Text className="text-lg font-semibold">Recent Searches:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentSearches.map((search, index) => (
              <View key={index} className="flex-row items-center">
                <Pressable
                  onPress={() => handleRecentSearch(search)}
                  className="bg-gray-200 rounded-full px-3 py-1 mr-2"
                >
                  <Text className="text-gray-700">{search}</Text>
                  <Pressable onPress={() => removeRecentSearch(search)}>
                    <Text className="text-red-500">X</Text>
                  </Pressable>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Categories Section */}
      {categories.length > 0 && (
        <ScrollView horizontal={true} className="flex-row mt-4">
          {categories.map((tag, index) => {
            const colors = [
              "#FF6347",
              "#4682B4",
              "#32CD32",
              "#FFD700",
              "#FF69B4",
              "#8A2BE2",
              "#5F9EA0",
              "#D2691E",
              "#DC143C",
              "#00FFFF",
              "#00008B",
              "#B8860B",
              "#006400",
              "#8B008B",
              "#FF8C00",
            ];
            const color = colors[index % colors.length];
            const backgroundColor = color + "10"; // Adding transparency

            return (
              <TouchableOpacity
                onPress={() => setSelectedCategory(tag)}
                key={tag}
                className={`px-3 py-1 mr-2 mb-2 rounded-full ${
                  selectedCategory === tag ? "bg-opacity-100" : "bg-opacity-10"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === tag ? color : backgroundColor,
                  borderColor: color,
                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    color: selectedCategory === tag ? "#fff" : color,
                    fontFamily: "Unbounded Light",
                  }}
                  className="text-xs"
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Loader */}
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <View className="flex-1 justify-center items-center">
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={50}
            color="gray"
          />
          <Text
            className="text-gray-500 mt-2 text-sm text-center px-4"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            No products found. Try a different search or category.
          </Text>
        </View>
      )}

      {/* Product List */}
      {!loading && filteredProducts.length > 0 && (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default SearchScreen;
