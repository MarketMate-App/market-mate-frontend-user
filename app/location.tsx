import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";

const INITIAL_REGION: Region = {
  latitude: 4.927,
  longitude: -1.777,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const LocationScreen: FC = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [region, setRegion] = useState<Region>(INITIAL_REGION);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const fetchUserLocation = async () => {
    setLoading(true);
    try {
      const { status: fineStatus } =
        await Location.requestForegroundPermissionsAsync();
      const { status: coarseStatus } =
        await Location.requestBackgroundPermissionsAsync();

      if (fineStatus !== "granted" || coarseStatus !== "granted") {
        Alert.alert("Permission Error", "Location permissions are required.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      updateLocationState(currentLocation);
    } catch (error) {
      console.error("Error fetching location:", error);
      Alert.alert("Error", "Unable to fetch location.");
    } finally {
      setLoading(false);
    }
  };

  const updateLocationState = (currentLocation: Location.LocationObject) => {
    if (!currentLocation?.coords) {
      throw new Error("Invalid location data.");
    }
    setLocation(currentLocation);
    setRegion({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: INITIAL_REGION.latitudeDelta,
      longitudeDelta: INITIAL_REGION.longitudeDelta,
    });
  };

  const handleUseCurrentLocation = async () => {
    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      updateLocationState(currentLocation);
      await saveLocation(currentLocation);
    } catch (error) {
      console.error("Error using current location:", error);
      Alert.alert("Error", "Unable to use current location.");
    } finally {
      setLoading(false);
    }
  };

  const saveLocation = async (loc: Location.LocationObject) => {
    try {
      await SecureStore.setItemAsync("userLocation", JSON.stringify(loc));
      Alert.alert("Success", "Location saved successfully.");
      router.back();
    } catch (error) {
      console.error("Error saving location:", error);
      Alert.alert("Error", "Failed to save location.");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2BCC5A" />
          <Text style={styles.infoText}>Fetching current location...</Text>
        </View>
      ) : (
        <>
          <MapView
            style={styles.map}
            region={region}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton
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
            <TouchableOpacity
              style={styles.button}
              onPress={handleUseCurrentLocation}
            >
              <Text style={styles.buttonText}>Use Current Location</Text>
            </TouchableOpacity>
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
  button: {
    backgroundColor: "#2BCC5A",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 12,
    fontFamily: "WorkSans Bold",
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "WorkSans Regular",
    textAlign: "center",
  },
});

export default LocationScreen;
