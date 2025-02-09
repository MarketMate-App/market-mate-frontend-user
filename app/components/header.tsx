import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
const HeaderComponent = () => {
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const savedLocation = await AsyncStorage.getItem("userLocation");
        if (savedLocation !== null) {
          const coordinates = JSON.parse(savedLocation);
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=YOUR_API_KEY`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            setLocation(data.results[0].formatted_address);
          }
        }
      } catch (error) {
        console.error("Failed to fetch location from AsyncStorage", error);
      }
    };

    fetchLocation();
  }, []);
  return (
    <View className="flex-row items-center justify-between w-full mb-4">
      <Link href={"/home"}>
        <View>
          <Text
            style={{ fontFamily: "Gilroy Medium" }}
            className="text-gray-500"
          >
            Deliver now
          </Text>
          <View className="flex-row items-center gap-1">
            <Link href={"/(tabs)/location"}>
              <Text
                className="text-sm"
                style={{ fontFamily: "Unbounded Regular" }}
              >
                Set delivery address
              </Text>
            </Link>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="black"
            />
          </View>
        </View>
      </Link>
      <View className="flex-row items-center gap-2">
        <Link href={"/screens/search"} asChild>
          <TouchableOpacity
            hitSlop={20}
            className="py-3 px-5 rounded-full bg-gray-50"
          >
            <Feather name="search" size={20} color="gray" />
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default HeaderComponent;
