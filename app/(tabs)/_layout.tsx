import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import {
  Entypo,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

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
            <Text style={{ color: focused ? "green" : "gray", fontSize: 11 }}>
              Shop
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Entypo name="shop" size={24} color={focused ? "green" : "gray"} />
          ),
          title: "Shop",
          headerTitleStyle: {
            fontFamily: "Gilroy Medium",
          },
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "green" : "gray", fontSize: 11 }}>
              Scan
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="scan"
              size={24}
              color={focused ? "green" : "gray"}
            />
          ),
          title: "Scan",
          headerTitleStyle: {
            fontFamily: "Gilroy Medium",
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "green" : "gray", fontSize: 11 }}>
              Profile
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Feather name="user" size={24} color={focused ? "green" : "gray"} />
          ),
          title: "Profile",
          headerTitleStyle: {
            fontFamily: "Gilroy Medium",
          },
        }}
      />
    </Tabs>
  );
};

export default RootLayout;
