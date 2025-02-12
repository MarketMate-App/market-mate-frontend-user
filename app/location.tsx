import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { router, Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";

const LocationScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [inputLocation, setInputLocation] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const handleLocationInput = () => {
    // Handle location input and update the map region
    // This is a placeholder for actual geocoding logic
    console.log("Location input:", inputLocation);
  };

  const handleUseCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    saveLocation();
  };
  const saveLocation = async () => {
    await SecureStore.setItemAsync("userLocation", JSON.stringify(location));
    console.log("Location saved");
    console.log(location);

    // Navigate to the previous screen
    router.back();

    // Or navigate to a specific screen
    // router.push("/home");
  };
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <MapView style={styles.map} region={region}>
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
        <TextInput
          style={styles.input}
          placeholder="Enter your location"
          value={inputLocation}
          onChangeText={setInputLocation}
        />
        <Button title="Set Location" onPress={handleLocationInput} />
        <Button
          title="Use Current Location"
          onPress={handleUseCurrentLocation}
        />
      </View>
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
  },
});

export default LocationScreen;
