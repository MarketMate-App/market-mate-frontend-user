import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";

const RootLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          elevation: 0, // Remove elevation on Android
          shadowOpacity: 0, // Remove shadow on iOS
          backgroundColor: "#fff", // Set background color
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "blue" : "black", fontSize: 12 }}>
              Shop
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Entypo name="shop" size={24} color={focused ? "blue" : "black"} />
          ),
          title: "Shop",
          headerTitleStyle: {
            fontFamily: "Gilroy Bold",
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user" size={24} color={color} />
          ),
          title: "Profile",
          headerTitleStyle: {
            fontFamily: "Gilroy Bold",
          },
        }}
      />
    </Tabs>
  );
};

export default RootLayout;
