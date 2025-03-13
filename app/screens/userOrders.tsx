import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Pressable,
  BackHandler,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";

type OrderStatus =
  | "pending"
  | "delivered"
  | "confirmed"
  | "dispatched"
  | "failed";
type OrderFilter = "all" | OrderStatus;

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: OrderStatus;
  items: any[];
}

const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
  pending: { color: "#9E9E9E", label: "Pending" },
  delivered: { color: "#4CAF50", label: "Delivered" },
  confirmed: { color: "#2196F3", label: "Confirmed" },
  dispatched: { color: "#FFC107", label: "Dispatched" },
  failed: { color: "#F44336", label: "Failed" },
};

const TABS: { label: string; value: OrderFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Dispatched", value: "dispatched" },
  { label: "Delivered", value: "delivered" },
  { label: "Failed", value: "failed" },
];

const UserOrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>("all");
  const navigation = useNavigation();

  // Intercept hardware back button to navigate to Profile screen.
  useEffect(() => {
    const backAction = () => {
      router.replace("/profile");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  // Helper function to fetch delivery status
  const fetchDeliveryStatus = async (orderId: string): Promise<OrderStatus> => {
    try {
      const response = await fetch(
        `http://192.168.43.155:3000/api/delivery/status/${orderId}`
      );
      const data = await response.json();
      // Validate response is one of the allowed statuses
      if (
        typeof data === "string" &&
        ["confirmed", "dispatched", "delivered", "failed"].includes(data)
      ) {
        return data as OrderStatus;
      }
      return "pending";
    } catch (error) {
      console.error("Failed to fetch delivery status", error);
      return "pending";
    }
  };

  // Fetch orders with data validation and update status if needed.
  const fetchOrders = useCallback(async () => {
    try {
      const user = await SecureStore.getItemAsync("user");
      if (!user) {
        console.error("User not found in SecureStore");
        return;
      }
      const parsedUser = JSON.parse(user);
      if (!parsedUser.phoneNumber) {
        console.error("Phone number is missing in user data");
        return;
      }
      const response = await fetch(
        `http://192.168.43.155:3000/api/orders/user/${parsedUser.phoneNumber}`
      );
      const data = await response.json();

      if (!Array.isArray(data)) {
        console.error("Unexpected response data:", data);
        return;
      }

      // Ensure all orders have a valid structure
      const validatedOrders: Order[] = data
        .filter(
          (order: any): order is Order => order && order._id && order.createdAt
        )
        .map((order: any) => ({
          ...order,
          status: order.status || "pending",
        }));

      // Update each order with a current delivery status if needed.
      const updatedOrders = await Promise.all(
        validatedOrders.map(async (order) => {
          try {
            const newStatus = await fetchDeliveryStatus(order._id);
            // Only update if newStatus is among our accepted statuses.
            if (
              [
                "confirmed",
                "dispatched",
                "delivered",
                "failed",
                "pending",
              ].includes(newStatus)
            ) {
              return { ...order, status: newStatus };
            }
            return order;
          } catch (error) {
            console.error("Error updating order status for:", order._id, error);
            return order;
          }
        })
      );
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Tab component for filtering orders.
  const renderTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-5 py-3"
    >
      {TABS.map((tab) => (
        <TouchableOpacity
          className="px-3 py-2 rounded-full mr-3 text-center border-hairline"
          key={tab.value}
          onPress={() => setSelectedFilter(tab.value)}
          style={{
            borderRadius: 20,
            backgroundColor:
              selectedFilter === tab.value ? "#2BCC5A20" : "#E5E7EB",
            borderColor: selectedFilter === tab.value ? "#2BCC5A" : "#E5E7EB",
          }}
        >
          <Text
            className="text-xs"
            style={{
              color: selectedFilter === tab.value ? "#2BCC5A" : "#000",
              fontFamily: "Unbounded SemiBold",
            }}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render status badge.
  const renderStatus = (status: OrderStatus) => {
    const { color, label } = statusConfig[status] || statusConfig.pending;
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 999,
          backgroundColor: `${color}10`,
          alignSelf: "flex-start",
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
            marginRight: 4,
          }}
        />
        <Text style={{ fontSize: 10, color, fontFamily: "Unbounded Regular" }}>
          {label}
        </Text>
      </View>
    );
  };

  // Render each order item.
  const renderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={{
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
      }}
      onPress={() => router.push(`/screens/trackDelivery/${item._id}` as any)}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Unbounded Medium",
            color: "#1F2937",
          }}
        >
          Order #{item._id.slice(-6).toUpperCase()}
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontFamily: "Unbounded Regular",
            color: "#6B7280",
          }}
        >
          {moment(item.createdAt).format("MMM D, YYYY - h:mm A")}
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 16, marginBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Unbounded Regular",
              color: "#4B5563",
            }}
          >
            ₵{Number(item.totalAmount).toFixed(2)}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="shopping-basket" size={16} color="#666" />
          <Text
            style={{
              fontSize: 12,
              fontFamily: "Unbounded Regular",
              color: "#4B5563",
              marginLeft: 4,
            }}
          >
            {item.items.length} Items
          </Text>
        </View>
      </View>
      {renderStatus(item.status)}
    </TouchableOpacity>
  );

  // Filter orders based on selected tab.
  const filteredOrders =
    selectedFilter === "all"
      ? orders
      : orders.filter((o) => o.status === selectedFilter);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View
      style={{ backgroundColor: "#F5F5F8", paddingBottom: 100 }}
      className="h-screen"
    >
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          title: "My Orders",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Unbounded Medium", fontSize: 14 },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (router.canGoBack()) {
                  router.back();
                } else {
                  router.replace("/profile");
                }
              }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      {renderTabs()}
      <FlatList
        data={[...filteredOrders].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListEmptyComponent={
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 50,
            }}
          >
            <Image
              source={require("@/assets/images/empty-cart.png")}
              style={{ width: 256, height: 256, marginBottom: 16 }}
            />
            <Text
              style={{
                fontFamily: "Unbounded Medium",
                fontSize: 18,
                color: "#4B5563",
                marginBottom: 8,
              }}
            >
              No orders found
            </Text>
            <Text
              style={{
                textAlign: "center",
                width: 320,
                color: "#6B7280",
                fontFamily: "Unbounded Light",
                fontSize: 12,
                marginBottom: 16,
              }}
            >
              Start placing orders to track your purchases here.
            </Text>
            <Pressable
              style={{
                width: "56%",
                paddingVertical: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: "#014E3C",
                alignItems: "center",
              }}
              onPress={() => router.push("/home")}
            >
              <Text
                style={{
                  color: "#014E3C",
                  fontFamily: "Unbounded SemiBold",
                  fontSize: 12,
                }}
              >
                View trending items
              </Text>
            </Pressable>
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

export default UserOrdersScreen;
