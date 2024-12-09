import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import React from "react";
import OrderIcon from "../../assets/icons/pin.svg";
import NotificationIcon from "../../assets/icons/bell.svg";
import ArrowRightIcon from "../../assets/icons/arrow-right.svg";
import StarIcon from "../../assets/icons/star.svg";
import AddIcon from "../../assets/icons/plus.svg";
import MinusIcon from "../../assets/icons/minus.svg";
import { SearchBar } from "react-native-screens";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import FruitCard from "../components/fruitCard";

const HomePage = () => {
  const fruits = [
    {
      name: "Orange",
      rating: 4.5,
      weight: "200g",
      price: 4.7,
      imgurl:
        "https://media.gettyimages.com/id/182463420/photo/tangerine-duo-with-leafs.jpg?s=612x612&w=0&k=20&c=d3JZRAqgqZ5RWyN4ryFteCnmFNbeD9e3TNJkS2IC0vU=",
    },
    {
      name: "Apple",
      rating: 5.0,
      weight: "590g",
      price: 5,
      imgurl:
        "https://media.gettyimages.com/id/183422512/photo/fresh-red-apples-on-white-background.jpg?s=612x612&w=0&k=20&c=OmfmcQLh3mwp4pFVQn9Sr2U8VCyIgGtV6fuaDmd3Yrk=",
    },
  ];
  return (
    <SafeAreaView className=" flex-1 flex-col p-3 bg-white">
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
        style={{ overflow: "hidden", borderRadius: 10 }}
        source={{
          uri: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        }}
        className="w-full h-40 bg-cover bg-center mb-4"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.6)"]}
          className="flex-1 border-0 rounded-lg p-5"
        >
          <View className="p-2">
            <Text className="text-white text-lg font-bold">
              Level 2 in June
            </Text>
            <Text className="text-white mb-6">
              8% off your favourite products
            </Text>
            <View className="items-center whitespace-nowrap justify-between flex-row">
              <Text className="text-black bg-white px-3 py-1 rounded-full">
                1200+ recipes
              </Text>
              <View className="bg-white p-1 rounded-full">
                <ArrowRightIcon width={24} height={24} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>

      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg">Fresh from the farm</Text>
        <Text className="text-blue-500">View all</Text>
      </View>
      <View>
        <View className="flex-row items-center gap-1">
          {fruits.map((fruit, index) => (
            <FruitCard
              key={index}
              name={fruit.name}
              imgurl={fruit.imgurl}
              rating={fruit.rating}
              weight={fruit.weight}
              price={fruit.price}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
