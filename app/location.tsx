import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";

interface LocationScreenProps {}

const INITIAL_REGION: Region = {
  latitude: 4.927,
  longitude: -1.777,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const LocationScreen: FC<LocationScreenProps> = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [loading, setLoading] = useState<boolean>(false);
  // Removed unused errorMsg state

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
      let { status: accessFineLocation } =
        await Location.requestForegroundPermissionsAsync();
      let { status: accessCoarseLocation } =
        await Location.requestBackgroundPermissionsAsync();

      if (accessFineLocation == null) {
        accessFineLocation = Location.PermissionStatus.DENIED;
      }
      if (accessCoarseLocation == null) {
        accessCoarseLocation = Location.PermissionStatus.DENIED;
      }

      if (
        accessFineLocation !== "granted" ||
        accessCoarseLocation !== "granted"
      ) {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        Alert.alert(
          "Permission Error",
          "Permission to access location was denied"
        );
        return;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: INITIAL_REGION.latitudeDelta,
          longitudeDelta: INITIAL_REGION.longitudeDelta,
        });
      } catch (error) {
        Alert.alert(
          "Error",
          "Failed to acquire current location. Please ensure location services are enabled."
        );
        console.error("Error fetching current location:", error);
      }
    } catch (error) {
      setErrorMsg("Failed to get current location");
      Alert.alert("Error", "Failed to get current location");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: INITIAL_REGION.latitudeDelta,
        longitudeDelta: INITIAL_REGION.longitudeDelta,
      });
      await saveLocation(currentLocation);
    } catch (error) {
      Alert.alert("Error", "Failed to acquire current location");
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (loc: Location.LocationObject) => {
    try {
      await SecureStore.setItemAsync("userLocation", JSON.stringify(loc));
      console.log("Location saved", loc);
      alert("Location saved successfully");
      router.replace("/(tabs)/cart");
    } catch (error) {
      Alert.alert("Error", "Failed to save location");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={"#2BCC5A"} />
          <Text style={styles.infoText}>
            Fetching your location, please wait...
          </Text>
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            region={region}
            showsMyLocationButton={true}
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
              />
            )}
          </MapView>
          <View style={styles.inputContainer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                className="bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white"
                onPress={() => handleUseCurrentLocation()}
              >
                <Text
                  className="text-white text-xs text-center"
                  style={{ fontFamily: "Unbounded SemiBold" }}
                >
                  Use Current Location
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    padding: 10,
    backgroundColor: "white",
  },
  buttonRow: {
    marginVertical: 5,
  },
  infoText: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: "Unbounded Regular",
    textAlign: "center",
  },
});

export default LocationScreen;
