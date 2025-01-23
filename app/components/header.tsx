import { View, Text } from "react-native";
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
            Pickup now
          </Text>
          <View className="flex-row items-center gap-1">
            <Text
              className="text-sm"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Justmoh Avenue
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="black"
            />
          </View>
        </View>
      </Link>
      <View className="flex-row items-center gap-2">
        <Link href={"/screens/search"}>
          <View className="py-3 px-5 rounded-full bg-gray-50">
            <Feather name="search" size={20} color="gray" />
          </View>
        </Link>
        {/* <Link href={"/screens/cart"}>
          <View className="bg-black py-2 px-4 rounded-full flex-row items-center justify-center gap-3">
            <Feather name="shopping-bag" size={24} color="white" />
            <Text
              className="text-white text-xl"
              style={{ fontFamily: "Gilroy Bold" }}
            >
              0
            </Text>
          </View>
        </Link> */}
      </View>
    </View>
  );
};

export default HeaderComponent;
