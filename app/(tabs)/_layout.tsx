import { View, Text } from "react-native";
import React from "react";
import { Stack, Tabs } from "expo-router";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useCartStore } from "../store/cartStore";

const RootLayout = () => {
  const cart = useCartStore((state) => (state as { cart: any[] }).cart);
  const cartItemCount = cart.length; // Define cartItemCount variable
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
            <Text
              style={{
                color: focused ? "#014E3C" : "gray",
                fontSize: 9,
                fontFamily: "Unbounded Regular",
              }}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons
              name={focused ? "home-filled" : "home-mini"}
              size={24}
              color={focused ? "#014E3C" : "gray"}
            />
          ),
          title: "Home",
          headerTitleStyle: {
            fontFamily: "Unbounded Medium",
          },
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          headerShown: false,
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#014E3C" : "gray",
                fontSize: 9,
                fontFamily: "Unbounded Regular",
              }}
            >
              Shop
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View>
              <MaterialCommunityIcons
                name={focused ? "storefront" : "storefront-outline"}
                size={24}
                color={focused ? "#014E3C" : "gray"}
              />
            </View>
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
            <Text
              style={{
                color: focused ? "#014E3C" : "gray",
                fontSize: 9,
                fontFamily: "Unbounded Regular",
              }}
            >
              Cart
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <View>
              <MaterialCommunityIcons
                name={focused ? "shopping" : "shopping-outline"}
                size={24}
                color={focused ? "#014E3C" : "gray"}
              />
              {cartItemCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    right: -6,
                    top: -3,
                    backgroundColor: "#014E3C",
                    borderRadius: 50,
                    width: 15,
                    height: 15,
                    justifyContent: "center",
                    alignItems: "center",
                    borderColor: "white",
                    borderWidth: 0.5,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 8,
                      fontFamily: "Unbounded SemiBold",
                      textAlign: "center",
                    }}
                  >
                    {cartItemCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          title: "My Cart",
          headerTitleStyle: {
            fontFamily: "Unbounded Regular",
            fontSize: 14,
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          // headerShown: false,
          headerTitleAlign: "center",
          headerShadowVisible: false,
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? "#014E3C" : "gray",
                fontSize: 8,
                fontFamily: "Unbounded Regular",
              }}
            >
              Me
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? "account-circle" : "account-circle-outline"}
              size={24}
              color={focused ? "#014E3C" : "gray"}
            />
          ),
          title: "My Account",
          headerTitleStyle: {
            fontFamily: "Unbounded Regular",
            fontSize: 14,
          },
        }}
      />
    </Tabs>
  );
};

export default RootLayout;
