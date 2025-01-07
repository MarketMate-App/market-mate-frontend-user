import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const RootLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          elevation: 0, // Remove elevation on Android
          shadowOpacity: 0, // Remove shadow on iOS
          backgroundColor: "#fff", // Set background color
          borderTopWidth: 0, // Remove top border
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "#014E3C" : "gray", fontSize: 11 }}>
              Shop
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Entypo
              name="shop"
              size={24}
              color={focused ? "#014E3C" : "gray"}
            />
          ),
          title: "Shop",
          headerTitleStyle: {
            fontFamily: "Unbounded Medium",
          },
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerShadowVisible: false,
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "#014E3C" : "gray", fontSize: 11 }}>
              Basket
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "basket" : "basket-outline"}
              size={24}
              color={focused ? "#014E3C" : "gray"}
            />
          ),
          title: "Your Cart",
          headerTitleStyle: {
            fontFamily: "Unbounded Medium",
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <Text style={{ color: focused ? "#014E3C" : "gray", fontSize: 11 }}>
              Account
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account" : "account-outline"}
              size={24}
              color={focused ? "#014E3C" : "gray"}
            />
          ),
          title: "Account",
          headerTitleStyle: {
            fontFamily: "Gilroy Medium",
          },
        }}
      />
    </Tabs>
  );
};

export default RootLayout;
