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
  const fetchDeliveryData = async () => {
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
        `http://192.168.43.155:3000/api/delivery/${id}`
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch delivery data", error);
    }
  };
  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDeliveryData();
  };

  return (
    <View>
      <Text>TrackDeliveryScreen</Text>
      <Text>{id}</Text>
    </View>
  );
};

export default TrackDeliveryScreen;
