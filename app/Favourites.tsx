import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const Favourites = () => {
  const fetchFavourites = async () => {
    try {
      const favs = await AsyncStorage.getItem("@userDetails");
      if (favs !== null) {
        const parsedFavourites = JSON.parse(favs);
        setFavourites(parsedFavourites.wishlist);
      }
    } catch (error) {
      console.error("Error fetching favourites:", error);
    }
  };
  const [favourites, setFavourites] = useState<string[]>([]); // Replace with actual data in a real-world scenario
  useEffect(() => {
    fetchFavourites();
  }, []);
  const renderFavouriteItem = ({ item }: { item: string }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavourite(item)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const handleRemoveFavourite = (item: string) => {
    setFavourites((prev) => prev.filter((fav) => fav !== item));
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          title: "My Favourites",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "WorkSans Medium", fontSize: 14 },
        }}
      />
      {favourites.length === 0 ? (
        <Text style={styles.emptyMessage}>You have no favourites yet.</Text>
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFavouriteItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "WorkSans Medium",
  },
  listContainer: {
    paddingBottom: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    fontFamily: "WorkSans Medium",
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "WorkSans SemiBold",
    textAlign: "center",
  },
});

export default Favourites;
