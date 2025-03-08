import React, { useState, useEffect, FC } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
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
  const [inputLocation, setInputLocation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        setLoading(false);
        Alert.alert(
          "Permission Error",
          "Permission to access location was denied"
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: INITIAL_REGION.latitudeDelta,
        longitudeDelta: INITIAL_REGION.longitudeDelta,
      });
    } catch (error) {
      setErrorMsg("Failed to get current location");
      Alert.alert("Error", "Failed to get current location");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationInput = () => {
    // Placeholder for geocoding logic:
    if (!inputLocation.trim()) {
      Alert.alert("Input Error", "Please enter a valid location");
      return;
    }
    console.log("Location input:", inputLocation);
    // Simulate geocoding success
    // In a real application, integrate a geocoding service (e.g., Google, Mapbox, etc.)
    // and update `region` accordingly.
    // For now, we'll simply alert the user.
    Alert.alert("Location Input", `Searching for "${inputLocation}"...`);
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
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to save location");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
      // Screen options can be adjusted as needed:
      // options={{ headerShown: false, presentation: "modal" }}
      />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={"#0000ff"} />
          <Text style={styles.infoText}>Loading your location...</Text>
        </View>
      ) : (
        <>
          <MapView style={styles.map} region={region}>
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
                image={require("@/assets/images/marker.png")}
              />
            )}
          </MapView>
          <View style={styles.inputContainer}>
            {/* {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            <TextInput
              style={styles.input}
              placeholder="Enter your location"
              value={inputLocation}
              onChangeText={setInputLocation}
            />
            <View style={styles.buttonRow}>
              <Button title="Search Location" onPress={handleLocationInput} />
            </View> */}
            <View style={styles.buttonRow}>
              <Pressable
                className="bg-[#2BCC5A] w-full py-5 rounded-full border-hairline border-white"
                onPress={() => handleUseCurrentLocation()}
              >
                <Text
                  className="text-white text-xs text-center"
                  style={{ fontFamily: "Unbounded SemiBold" }}
                >
                  Use Current Location
                </Text>
              </Pressable>
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buttonRow: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
    textAlign: "center",
  },
  infoText: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: "Unbounded Regular",
    textAlign: "center",
  },
});

export default LocationScreen;
