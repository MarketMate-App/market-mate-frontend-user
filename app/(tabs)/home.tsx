import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";
import React from "react";
import OrderIcon from "../../assets/icons/pin.svg";
import NotificationIcon from "../../assets/icons/bell.svg";
import { SearchBar } from "react-native-screens";
import { SafeAreaView } from "react-native-safe-area-context";

const HomePage = () => {
  return (
    <SafeAreaView className=" flex-1 flex-col p-5 bg-white">
      <View className=" flex-row items-center justify-between mb-4">
        <View className="flex-row items-center justify-center">
          <OrderIcon width={24} height={24} />
          <View className=" ml-2 text-left">
            <Text className="text-sm color-gray-300">Express Delivery</Text>
            <Text className="text-large">Justmoh Avenue</Text>
          </View>
        </View>
        <View className="gap-1">
          <NotificationIcon width={24} height={24} fill={"#d1d5db"} />
        </View>
      </View>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        className="w-full h-52 bg-cover bg-center rounded-lg"
      >
        <View className="flex-1 items-center justify-center overlay">
          <Text className="text-2xl font-bold text-white">
            Welcome to Justmoh
          </Text>
          <Text className="text-lg font-normal text-white">
            Order your favorite meals
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  overlay: {
    color: "rgba(0,0,0,0.4)",
  },
});

export default HomePage;
