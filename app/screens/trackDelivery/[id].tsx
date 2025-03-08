import React, { useEffect, useState } from "react";
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
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";

import { useGlobalSearchParams } from "expo-router";

interface Order {
  _id: string;
  status?: "pending" | "confirmed" | "dispatched" | "delivered" | "failed";
  // other order properties if needed
}

const TrackDeliveryScreen = () => {
  const { id } = useGlobalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Fetch orders from the API with data validation
  const fetchOrder = async () => {
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
        `http://192.168.43.155:3000/api/orders/${id}`
      );
      const data = await response.json();
      // Ensure that the data is an array before setting state
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Unexpected response data:", data);
      }
      const updatedOrders = await Promise.all(
        data.map(async (order: Order): Promise<Order> => {
          if (!order || typeof order !== "object" || !order._id) {
            console.error("Invalid order data", order);
            return order;
          }
          try {
            const statusResult = await fetchDeliveryStatus(order._id);
            const status =
              typeof statusResult === "string" && statusResult
                ? statusResult
                : "pending";

            if (typeof status === "string") {
              if (
                ["confirmed", "dispatched", "delivered", "failed"].includes(
                  status
                )
              ) {
                return { ...order, status: status as Order["status"] };
              } else {
                console.warn(
                  "Unexpected status value received for order",
                  order._id,
                  ":",
                  status
                );
                return order;
              }
            } else {
              console.error(
                "Invalid status type received for order",
                order._id,
                ":",
                status
              );
              return order;
            }
          } catch (error) {
            console.error("Error updating status for order", order._id, error);
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
  };

  // Optional: fetch the up-to-date delivery status for an order
  const fetchDeliveryStatus = async (orderId: string): Promise<string> => {
    try {
      const response = await fetch(
        `http://192.168.43.155:3000/api/delivery/status/${orderId}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch delivery status", error);
      return "pending";
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrder();
  };

  return (
    <View>
      <Text>TrackDeliveryScreen</Text>
      <Text>{id}</Text>
    </View>
  );
};

export default TrackDeliveryScreen;
