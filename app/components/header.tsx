import React, { useEffect, useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Link, router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";

const GOOGLE_MAPS_API_KEY = "AIzaSyCUgJkMiraPAXlkSNeyA3wVFW0amffBkHo";

const fetchLocationData = async (latitude: number, longitude: number) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location data");
    }

    const data = await response.json();
    if (data.results?.length > 0) {
      const addressComponents = data.results[0].formatted_address.split(",");
      return addressComponents.slice(0, -1).join(",").trim();
    }

    return "Location not found";
  } catch (error) {
    console.error("Error fetching location data:", error);
    return "Error fetching location";
  }
};

const HeaderComponent = () => {
  const [location, setLocation] = useState<string>("Fetching location...");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    try {
      const savedLocation = await SecureStore.getItemAsync("userLocation");
      if (savedLocation) {
        const { coords } = JSON.parse(savedLocation);
        if (coords?.latitude && coords?.longitude) {
          const formattedAddress = await fetchLocationData(
            coords.latitude,
            coords.longitude
          );
          setLocation(formattedAddress);
        } else {
          setLocation("Invalid coordinates");
        }
      } else {
        setLocation("No location saved");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocation("Error fetching location");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const locationDisplay = useMemo(
    () =>
      isLoading ? (
        <ActivityIndicator size="small" color="gray" />
      ) : (
        <Text className="text-sm" style={{ fontFamily: "WorkSans Bold" }}>
          {location}
        </Text>
      ),
    [isLoading, location]
  );

  return (
    <View className="flex-row items-center justify-between w-full mb-4 px-2">
      <Link href="/location">
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
        <Link href="/screens/search" asChild>
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
