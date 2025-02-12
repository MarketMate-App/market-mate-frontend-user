import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";

const UserOrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const fetchOrders = async () => {
    try {
      const user = await SecureStore.getItemAsync("user");
      if (!user) {
        console.error("User not found in SecureStore");
        return;
      }

      const response = await fetch(
        `http://192.168.43.155:3000/api/orders/user/${
          JSON.parse(user).phoneNumber
        }`
      );
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const renderStatus = (status) => {
    const statusConfig = {
      pending: { color: "#FFA500", label: "Processing" },
      delivered: { color: "#4CAF50", label: "Delivered" },
      cancelled: { color: "#F44336", label: "Cancelled" },
    };

    const { color, label } = statusConfig[status] || {
      color: "#9E9E9E",
      label: "Pending",
    };

    return (
      <View style={[styles.statusContainer, { backgroundColor: `${color}20` }]}>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
        <Text style={[styles.statusText, { color }]}>{label}</Text>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate("OrderDetails", { orderId: item._id })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>
          Order #{item._id.slice(-6).toUpperCase()}
        </Text>
        <Text style={styles.orderDate}>
          {moment(item.date).format("MMM D, YYYY - h:mm A")}
        </Text>
      </View>

      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <MaterialIcons name="attach-money" size={16} color="#666" />
          <Text style={styles.detailText}> ₵{item.totalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.detailItem}>
          <MaterialIcons name="local-shipping" size={16} color="#666" />
          <Text style={styles.detailText}>{item.items.length} Items</Text>
        </View>
      </View>

      {renderStatus(item.status)}
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          title: "My Orders",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Unbounded Medium", fontSize: 14 },
        }}
      />

      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require("@/assets/images/empty-cart.png")}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No Orders Found</Text>
            <Text style={styles.emptySubText}>
              Your orders will appear here
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  orderNumber: {
    fontFamily: "Unbounded Medium",
    fontSize: 14,
    color: "#1F2937",
  },
  orderDate: {
    fontFamily: "Unbounded Light",
    fontSize: 10,
    color: "#6B7280",
  },
  orderDetails: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontFamily: "Unbounded Regular",
    fontSize: 12,
    color: "#374151",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontFamily: "Unbounded SemiBold",
    fontSize: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  emptyText: {
    fontFamily: "Unbounded Medium",
    fontSize: 18,
    color: "#1F2937",
    marginBottom: 8,
  },
  emptySubText: {
    fontFamily: "Unbounded Regular",
    fontSize: 14,
    color: "#6B7280",
  },
});

export default UserOrdersScreen;
