import { View, Text, ImageBackground, Pressable } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import StarIcon from "../../assets/icons/star.svg";
import AddIcon from "../../assets/icons/plus.svg";
import MinusIcon from "../../assets/icons/minus.svg";
import FavoriteIcon from "../../assets/icons/heart.svg";

const FruitCard = ({ name, rating, weight, price, imgurl }) => {
  return (
    <View className="p-2">
      <ImageBackground
        source={{
          uri: imgurl,
        }}
        className="w-44 h-44 bg-cover bg-center rounded-lg mb-4"
        style={{ overflow: "hidden", borderRadius: 10 }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "transparent"]}
          className="flex-1 border-0 rounded-lg p-2"
        >
          <Pressable className="">
            <FavoriteIcon width={24} height={24} fill={"red"} />
          </Pressable>
        </LinearGradient>
      </ImageBackground>
      <View className=" flex-row items-center justify-between">
        <Text className="font=bold text-xl">{name}</Text>
        <View className="flex-row gap-1 mb-2">
          <StarIcon width={16} height={16} fill={"yellow"} />
          <Text className="font-bold">{rating}</Text>
        </View>
      </View>
      <Text className="text-slate-400 mb-4">590g</Text>
      <Pressable className="bg-black text-white px-4 py-[8px]   rounded-full flex-row-reverse items-center justify-between">
        <AddIcon width={24} height={24} fill={"white"} />
        <Text className="text-center text-slate-100 font-bold ">
          Gh₵ {price}
        </Text>
      </Pressable>
    </View>
  );
};

export default FruitCard;
