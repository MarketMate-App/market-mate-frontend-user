import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const HeaderComponent = () => {
  const [location, setLocation] = useState<string | null>(
    "Fetching location..."
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const savedLocation = await SecureStore.getItemAsync("userLocation");

        if (savedLocation) {
          const coordinates = JSON.parse(savedLocation);
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch location data");
          }

          const data = await response.json();

          if (data.results.length > 0) {
            setLocation(data.results[0].formatted_address);
          } else {
            setLocation("Location not found");
          }
        } else {
          setLocation("No location saved");
        }
      } catch (error) {
        setLocation("No location saved");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return (
    <View className="flex-row items-center justify-between w-full mb-4 px-2">
      <Link href={"/location"}>
        <View>
          <Text
            style={{ fontFamily: "WorkSans SemiBold" }}
            className="text-gray-500"
          >
            Deliver now
          </Text>
          <TouchableOpacity
            hitSlop={20}
            onPress={() => router.push("/location")}
          >
            <View className="flex-row items-center gap-1">
              {isLoading ? (
                <ActivityIndicator size="small" color="gray" />
              ) : (
                <Text
                  className="text-sm"
                  style={{ fontFamily: "WorkSans Bold" }}
                >
                  {location}
                </Text>
              )}
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color="black"
              />
            </View>
          </TouchableOpacity>
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
