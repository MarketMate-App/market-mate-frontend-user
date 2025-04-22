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
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { isLoading } from "expo-font";
import UserAvatar from "../components/userAvatar";

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
  payment: {
    amount: number;
  };
  courier: any;
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

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const UserOrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<OrderFilter>("all");
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>([]);
  const navigation = useNavigation();

  // Intercept hardware back button to navigate to Profile screen.
  // Fetch orders with data validation and update status if needed.
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = await SecureStore.getItemAsync("jwtToken");
      if (!token) {
        console.error("No token found in secure storage.");
        return;
      }
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/orders/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error("Invalid data format", data);
        return;
      }
      setOrders(data);

      const validatedOrders: Order[] = data
        .filter(
          (order: any): order is Order => order && order._id && order.createdAt
        )
        .map((order: any) => ({
          ...order,
          status: order.status || "pending",
        }));
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    const preventBackNavigation = () => {
      router.replace("/profile");
    };

    const handleBeforeRemove = (e: any) => {
      e.preventDefault();
      preventBackNavigation();
    };

    const backHandler = () => {
      preventBackNavigation();
      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backHandler
    );

    return () => subscription.remove();
  }, [router]);
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
      className="px-5 py-1 bg-white"
    >
      {TABS.map((tab) => (
        <TouchableOpacity
          className="px-3 min-h-8 items-center justify-center rounded-full mr-3 mb-2 text-center border-hairline"
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
              color: selectedFilter === tab.value ? "#2BCC5A" : "#374151",
              fontFamily: "Unbounded Regular",
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

  const toggleExpansion = (orderId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Render each order item with expandable details.
  const renderItem = ({ item }: { item: Order }) => {
    const isExpanded = expandedOrderIds.includes(item._id);
    return (
      <>
        <TouchableOpacity
          className={`${isExpanded ? "mb-1" : "mb-3"} ${
            isExpanded ? "rounded-t-3xl" : "rounded-2xl"
          }`}
          style={{
            backgroundColor: "#fff",
            padding: 16,
          }}
          onPress={() => toggleExpansion(item._id)}
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
                ₵{Number(item.payment.amount).toFixed(2)}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="shopping-basket" size={16} color="#4B5563" />
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
          {isExpanded && (
            <View style={{ marginTop: 12 }}>
              <Text
                style={{
                  fontFamily: "Unbounded Medium",
                  fontSize: 14,
                  marginBottom: 8,
                  color: "#1F2937",
                }}
              >
                Order Details
              </Text>
              {item.items.length ? (
                item.items.map((itm, index) => (
                  <Text
                    key={index}
                    style={{
                      fontFamily: "Unbounded Regular",
                      fontSize: 12,
                      color: "#4B5563",
                      marginBottom: 4,
                    }}
                  >
                    • {itm.name || `Item ${index + 1}`} x{itm.quantity}
                  </Text>
                ))
              ) : (
                <Text
                  style={{
                    fontFamily: "Unbounded Regular",
                    fontSize: 12,
                    color: "#4B5563",
                  }}
                >
                  No items available.
                </Text>
              )}
            </View>
          )}
        </TouchableOpacity>
        {isExpanded && item.courier && (
          <View
            className="p-4 rounded-b-3xl"
            style={{
              backgroundColor: "#fff",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <UserAvatar
                  size={50}
                  imageUrl={item.courier.user.profilePicture}
                  name={item.courier.user.fullName}
                />
                <View style={{ marginLeft: 8 }}>
                  <Text
                    style={{
                      fontFamily: "Unbounded Regular",
                      fontSize: 12,
                      color: "#4B5563",
                    }}
                  >
                    {item.courier.user.fullName || "Your MarketMate"}
                  </Text>
                  {item.courier.vehicle.registrationNumber ? (
                    <Text
                      style={{
                        fontFamily: "Unbounded SemiBold",
                        fontSize: 10,
                        color: "#374151",
                        marginBottom: 4,
                      }}
                    >
                      {item.courier.vehicle.registrationNumber}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontFamily: "Unbounded Regular",
                        fontSize: 10,
                        color: "#6B7280",
                        marginBottom: 4,
                      }}
                    >
                      Registration Number:{" "}
                      <Text
                        style={{
                          fontFamily: "Unbounded SemiBold",
                          color: "#374151",
                        }}
                      >
                        N/A
                      </Text>
                    </Text>
                  )}
                  <Text
                    style={{
                      fontFamily: "Unbounded Regular",
                      fontSize: 10,
                      color: "#6B7280",
                    }}
                  >
                    {item.status === "pending"
                      ? "Awaiting confirmation"
                      : item.status === "confirmed"
                      ? "Preparing your order"
                      : item.status === "dispatched"
                      ? "On the way!"
                      : item.status === "delivered"
                      ? "Delivered successfully"
                      : "Order failed"}
                  </Text>
                </View>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`tel:${item.courier.user.phoneNumber}`)
                  }
                  style={{
                    padding: 8,
                    backgroundColor: "#2BCC5A20",
                    borderRadius: 20,
                  }}
                >
                  <MaterialIcons name="call" size={20} color="#2BCC5A" />
                </TouchableOpacity>
                {/* <TouchableOpacity
                  onPress={() => router.push(`/chat/${item.courier.user._id}`)}
                  style={{
                    padding: 8,
                    backgroundColor: "#2BCC5A20",
                    borderRadius: 20,
                  }}
                >
                  <MaterialIcons name="chat" size={20} color="#2BCC5A" />
                </TouchableOpacity> */}
              </View>
            </View>
            {/* {(() => {
                const getCourierStatusStyle = (status: string) => {
                  // Customize these cases as needed
                  switch (status.toLowerCase()) {
                    case "available":
                      return { color: "#4CAF50", label: "Online" };
                    case "offline":
                      return { color: "#F44336", label: "Offline" };
                    case "on-delivery":
                      return { color: "#FFC107", label: "On Delivery" };
                    default:
                      return {
                        color: "#9E9E9E",
                        label: status.charAt(0).toUpperCase() + status.slice(1),
                      };
                  }
                };
                const { color, label } = getCourierStatusStyle(
                  item.courier.status
                );
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: `${color}10`,
                      padding: 8,
                      borderRadius: 999,
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
                    <Text
                      style={{
                        fontFamily: "Unbounded Regular",
                        fontSize: 10,
                        color: color,
                      }}
                    >
                      {label.toLowerCase()}
                    </Text>
                  </View>
                );
              })()} */}
          </View>
        )}
      </>
    );
  };

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
    <View style={{ paddingBottom: 50 }} className="bg-[#ffffff90]">
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          title: "My Orders",
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: "Unbounded Medium", fontSize: 14 },
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
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 8,
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Image
              source={require("@/assets/images/empty-cart.png")}
              className="w-64 h-64 mb-8"
            />
            <Text
              className="text-lg text-gray-700 mb-4"
              style={{ fontFamily: "Unbounded Medium" }}
            >
              No orders yet?
            </Text>
            <Text
              className="text-center w-80 text-gray-500 mb-8 text-xs"
              style={{ fontFamily: "Unbounded Light" }}
            >
              Explore our wide range of products and find something you love.
              Start shopping now and make your first order today!
            </Text>
            <TouchableOpacity
              className="w-[56%] px-8 py-5 rounded-full border-hairline border-[#014E3C]"
              onPress={() => router.push("/home")}
            >
              <Text
                className="text-[#014E3C] text-xs text-center"
                style={{ fontFamily: "Unbounded SemiBold" }}
              >
                Browse popular products
              </Text>
            </TouchableOpacity>
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
