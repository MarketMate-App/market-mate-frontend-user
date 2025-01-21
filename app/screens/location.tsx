import { View, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useState, useEffect } from "react";
import { Button, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

const LocationSelectionScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [address, setAddress] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      await AsyncStorage.setItem("userLocation", JSON.stringify(location));
    })();
  }, []);

  const saveLocation = async () => {
    try {
      await AsyncStorage.setItem("userLocation", JSON.stringify(location));
      alert("Location saved successfully!");
    } catch (error) {
      console.error("Error saving location: ", error);
    }
  };

  const searchLocation = async () => {
    try {
      let geocode = await Location.geocodeAsync(address);
      if (geocode.length > 0) {
        const newLocation = {
          coords: {
            latitude: geocode[0].latitude,
            longitude: geocode[0].longitude,
            altitude: 0,
            accuracy: 0,
            altitudeAccuracy: 0,
            heading: 0,
            speed: 0,
          },
          timestamp: Date.now(),
        };
        setLocation(newLocation);
        await AsyncStorage.setItem("userLocation", JSON.stringify(newLocation));
      }
    } catch (error) {
      console.error("Error searching location: ", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location ? location.coords.latitude : 37.78825,
          longitude: location ? location.coords.longitude : -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"Selected Location"}
            description={"This is the selected location"}
          />
        )}
      </MapView>
      <View style={{ padding: 10 }}>
        <TextInput
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginBottom: 10,
          }}
        />
        <Button title="Search Location" onPress={searchLocation} />
        <Button title="Save Location" onPress={saveLocation} />
      </View>
    </View>
  );
};

export default LocationSelectionScreen;
