import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const fetchLocationData = async (coordinates: {
  latitude: number;
  longitude: number;
}) => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=AIzaSyCUgJkMiraPAXlkSNeyA3wVFW0amffBkHo`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch location data");
  }

  const data = await response.json();

  if (data.results.length > 0) {
    const addressComponents = data.results[0].formatted_address.split(",");
    // Exclude the country (last part of the address)
    return addressComponents.slice(0, -1).join(",").trim();
  }

  return "Location not found";
};

const HeaderComponent = () => {
  const [location, setLocation] = useState<string>("Fetching location...");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLocation = useCallback(async () => {
    try {
      const savedLocation = await SecureStore.getItemAsync("userLocation");
      if (savedLocation) {
        const coordinates = JSON.parse(savedLocation)?.coords;
        if (!coordinates?.latitude || !coordinates?.longitude) {
          throw new Error("Invalid coordinates");
        }

        const formattedAddress = await fetchLocationData(coordinates);
        setLocation(formattedAddress);
      } else {
        setLocation("No location saved");
      }
    } catch {
      setLocation("No location saved");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const locationDisplay = useMemo(() => {
    return isLoading ? (
      <ActivityIndicator size="small" color="gray" />
    ) : (
      <Text className="text-sm" style={{ fontFamily: "WorkSans Bold" }}>
        {location}
      </Text>
    );
  }, [isLoading, location]);

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
              {locationDisplay}
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

export default React.memo(HeaderComponent);
