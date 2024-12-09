import { View, Text } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { Tabs } from "expo-router";
import CartIcon from "../../assets/icons/shopping-bag-2.svg";
import HomeIcon from "../../assets/icons/home.svg";
import ProfileIcon from "../../assets/icons/user.svg";
import FavoritesIcon from "../../assets/icons/heart.svg";
import OrderIcon from "../../assets/icons/ticket.svg";

const RootLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          shadowColor: "transparent",
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              className="w-6 h-6"
              fill={focused ? "#181818" : "lightgray"}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Saved",
          tabBarIcon: ({ focused }) => (
            <FavoritesIcon
              className="w-6 h-6"
              fill={focused ? "#181818" : "lightgray"}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarIcon: ({ focused }) => (
            <OrderIcon
              className="w-6 h-6"
              fill={focused ? "#181818" : "lightgray"}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ focused }) => (
            <CartIcon
              className="w-6 h-6"
              fill={focused ? "#181818" : "lightgray"}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <ProfileIcon
              className="w-6 h-6"
              fill={focused ? "#181818" : "lightgray"}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default RootLayout;
