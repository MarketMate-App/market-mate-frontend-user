import { View, Text, SafeAreaView, Platform } from "react-native";
import React from "react";
import HeaderComponent from "../components/header";
import { useHeaderHeight } from "@react-navigation/elements";
import CategoriesComponent from "../components/categories";
import GuestBanner from "../components/guestbanner";

const HomePage = () => {
  const headerHeight = useHeaderHeight();
  console.log(headerHeight);

  return (
    <View
      style={{ paddingTop: Platform.OS === "ios" ? 50 : 0 }}
      className="flex-1 bg-white p-3"
    >
      <HeaderComponent />
      <CategoriesComponent />
      <GuestBanner />
    </View>
  );
};

export default HomePage;
