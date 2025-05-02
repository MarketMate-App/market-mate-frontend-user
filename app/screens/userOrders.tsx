import React, { useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MaterialIcons } from "@expo/vector-icons";
import UserAvatar from "../components/userAvatar";
import moment from "moment";

const userOrders = () => {
  const renderStatus = React.useCallback((status: string) => {
    let statusColor = "#6B7280"; // Default color
    let statusText = "Unknown";

    switch (status) {
      case "pending":
        statusColor = "#F59E0B";
        statusText = "Pending";
        break;
      case "confirmed":
        statusColor = "#3B82F6";
        statusText = "Confirmed";
        break;
      case "dispatched":
        statusColor = "#10B981";
        statusText = "Dispatched";
        break;
      case "delivered":
        statusColor = "#22C55E";
        statusText = "Delivered";
        break;
      case "failed":
        statusColor = "#EF4444";
        statusText = "Failed";
        break;
    }

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 999,
          backgroundColor: `${statusColor}10`,
          alignSelf: "flex-start",
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: statusColor,
            marginRight: 4,
          }}
        />
        <Text
          style={{
            fontSize: 10,
            color: statusColor,
            fontFamily: "WorkSans SemiBold",
          }}
        >
          {statusText}
        </Text>
      </View>
    );
  }, []);

  interface Order {
    createdAt: string | number | Date;
    payment: any;
    items: any;
    courier: boolean;
    _id: string;
    totalAmount: number;
    status: string;
  }

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [selectedFilter, setSelectedFilter] = React.useState<string>("all");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [expandedOrderIds, setExpandedOrderIds] = React.useState<string[]>([]);

  const toggleExpansion = React.useCallback((orderId: string) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  }, []);

  const renderItem = React.useCallback(
    ({ item }: { item: Order }) => {
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
                  fontFamily: "WorkSans Bold",
                  color: "#1F2937",
                }}
              >
                Order #{item._id.slice(0, 6)}
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
                <MaterialIcons
                  name="shopping-basket"
                  size={16}
                  color="#4B5563"
                />
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "WorkSans Medium",
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
                    fontFamily: "WorkSans Medium",
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
                        fontFamily: "WorkSans SemiBold",
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
                      fontFamily: "WorkSans Regular",
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
          {isExpanded && (
            <View
              className="p-4 rounded-b-3xl"
              style={{
                backgroundColor: "#fff",
                marginBottom: 12,
              }}
            >
              {item.courier ? (
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
                          fontFamily: "WorkSans Bold",
                          fontSize: 12,
                          color: "#4B5563",
                        }}
                      >
                        {item.courier.user.fullName || "Your MarketMate"}
                      </Text>
                      {item.courier.vehicle.registrationNumber ? (
                        <Text
                          style={{
                            fontFamily: "WorkSans SemiBold",
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
                            fontFamily: "WorkSans Regular",
                            fontSize: 10,
                            color: "#6B7280",
                            marginBottom: 4,
                          }}
                        >
                          Registration Number:{" "}
                          <Text
                            style={{
                              fontFamily: "WorkSans SemiBold",
                              color: "#374151",
                            }}
                          >
                            N/A
                          </Text>
                        </Text>
                      )}
                      <Text
                        style={{
                          fontFamily: "WorkSans Regular",
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
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
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
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 16,
                  }}
                >
                  <MaterialIcons
                    name="info-outline"
                    size={24}
                    color="#6B7280"
                    style={{ marginBottom: 8 }}
                  />
                  <Text
                    style={{
                      fontFamily: "WorkSans Regular",
                      fontSize: 12,
                      color: "#6B7280",
                      textAlign: "center",
                    }}
                  >
                    No courier assigned to this order yet. Please check back
                    later for updates.
                  </Text>
                </View>
              )}
            </View>
          )}
        </>
      );
    },
    [expandedOrderIds, renderStatus]
  );

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwtToken");
        if (token) {
          const response = await fetch(
            `${
              process.env.EXPO_PUBLIC_API_URL ||
              "https://marketmate-backend.onrender.com"
            }/api/orders/user`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          console.log("User Orders:", data);
          if (response.ok) {
            setOrders(data);
            setLoading(false);
          } else {
            setError(data || "Failed to fetch orders");
            setLoading(false);
          }
        } else {
          console.log("No user found. Please log in.");
          router.replace("/auth");
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }
    };
    fetchUserOrders();
  }, []);

  const TABS = useMemo(
    () => [
      { value: "all", label: "All" },
      { value: "confirmed", label: "Processing" },
      { value: "dispatched", label: "Dispatched" },
      { value: "delivered", label: "Delivered" },
      { value: "failed", label: "Failed" },
    ],
    []
  );

  const renderTabs = React.useCallback(
    () => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{
          paddingHorizontal: 4,
          paddingVertical: 8,
          backgroundColor: "#fff",
        }}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => setSelectedFilter(tab.value)}
            style={{
              paddingHorizontal: 12,
              height: 32,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 16,
              marginRight: 8,
              backgroundColor:
                selectedFilter === tab.value ? "#2BCC5A20" : "#E5E7EB",
              borderWidth: 1,
              borderColor: selectedFilter === tab.value ? "#2BCC5A" : "#E5E7EB",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: selectedFilter === tab.value ? "#2BCC5A" : "#374151",
                fontFamily: "WorkSans SemiBold",
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ),
    [TABS, selectedFilter]
  );

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) =>
        selectedFilter === "all" ? true : order.status === selectedFilter
      ),
    [orders, selectedFilter]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F3F4F6" }}>
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 8,
          backgroundColor: "#fff",
        }}
      >
        {renderTabs()}
      </View>
      {loading ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text
              style={{
                fontFamily: "WorkSans SemiBold",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              <ActivityIndicator
                size="small"
                color="#2BCC5A"
                style={{ marginBottom: 8 }}
              />
            </Text>
          </View>
        </ScrollView>
      ) : error ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "WorkSans SemiBold",
              fontSize: 14,
              color: "#EF4444",
            }}
          >
            Error: {error}
          </Text>
        </View>
      ) : filteredOrders.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginBottom: 16,
          }}
        >
          {filteredOrders
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((order) => (
              <View key={order._id}>{renderItem({ item: order })}</View>
            ))}
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Image
            source={require("@/assets/images/empty-cart.png")}
            className="w-64 h-64 mb-8"
          />
          {orders.length === 0 ? (
            <>
              <Text
                className="text-lg text-gray-700 mb-4"
                style={{ fontFamily: "WorkSans Medium" }}
              >
                No orders yet?
              </Text>
              <Text
                className="text-center w-80 text-gray-500 mb-8 text-xs"
                style={{ fontFamily: "WorkSans Light" }}
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
                  style={{ fontFamily: "WorkSans SemiBold" }}
                >
                  Browse popular products
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text
                className="text-lg text-gray-700 mb-4"
                style={{ fontFamily: "WorkSans Medium" }}
              >
                No "{selectedFilter}" orders found.
              </Text>
              <Text
                className="text-center w-80 text-gray-500 mb-8 text-xs"
                style={{ fontFamily: "WorkSans Light" }}
              >
                Try selecting a different filter or refresh the page to check
                for updates.
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default React.memo(userOrders);
