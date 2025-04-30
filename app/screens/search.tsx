import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link } from "expo-router";
import { debounce } from "lodash";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem("@products");
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }
      } catch (error) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const debouncedFilter = debounce(() => {
      if (searchQuery.trim() === "") {
        setFilteredProducts([]);
      } else {
        const filtered = products.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    }, 300);

    debouncedFilter();
    return () => debouncedFilter.cancel();
  }, [searchQuery, products]);

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredProducts([]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>Search for products below:</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          accessibilityLabel="Search input"
        />
        {searchQuery.trim() !== "" && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <Link
              key={product._id}
              href={`products/${product._id}`}
              style={styles.productLink}
            >
              <Text style={styles.product}>{product.name}</Text>
            </Link>
          ))
        ) : searchQuery.trim() !== "" ? (
          <Text style={styles.noResultsText}>
            No products found. Try a different search term.
          </Text>
        ) : (
          <Text style={styles.emptyStateText}>
            Start typing to search for products.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 8,
    color: "#555",
    fontFamily: "WorkSans Bold",
  },
  productLink: {
    textDecorationLine: "none",
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 4,
    borderBottomColor: "#eee",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    fontFamily: "WorkSans SemiBold",
  },
  clearButton: {
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "WorkSans Bold",
  },
  scrollViewContent: {
    paddingBottom: 16,
  },
  product: {
    fontSize: 18,
    borderBottomWidth: 1,
    padding: 20,
    borderBottomColor: "#eee",
    fontFamily: "WorkSans Regular",
  },
  noResultsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
    fontFamily: "WorkSans SemiBold",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
    fontFamily: "WorkSans SemiBold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Search;
