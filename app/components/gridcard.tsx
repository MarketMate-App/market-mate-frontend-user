import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";

import { ImageSourcePropType } from "react-native";

interface GridcardProps {
  name: string;
  price: number;
  imageUrl: ImageSourcePropType;
}

const GridcardComponent: React.FC<GridcardProps> = ({
  name,
  price,
  imageUrl,
}) => {
  const [heartFilled, setHeartFilled] = React.useState(false);

  return (
    <View className="p-4 border-hairline border-gray-300 rounded-3xl w-[180px] mr-3">
      <ImageBackground
        source={imageUrl}
        className="h-[100px] mb-4"
        resizeMode="center"
      >
        <AntDesign
          name={heartFilled ? "heart" : "hearto"}
          size={20}
          color={heartFilled ? "red" : "gray"}
          onPress={() => setHeartFilled(!heartFilled)}
        />
      </ImageBackground>
      <View>
        <Text
          className="text-black text-xl mb-4"
          style={{ fontFamily: "Gilroy Bold" }}
        >
          {name}
        </Text>
        <Text className="text-gray-500" style={{ fontFamily: "Gilroy Medium" }}>
          1kg
        </Text>
        <View className="flex-row items-center justify-between">
          <Text
            className="text-2xl relative"
            style={{ fontFamily: "Gilroy Bold" }}
          >
            ₵{Math.floor(price)}
            <Text style={{ fontSize: 12, fontFamily: "Gilroy Regular" }}>
              .
              {price.toFixed(2).split(".")[1] === "00"
                ? "00"
                : price.toFixed(2).split(".")[1]}
            </Text>
          </Text>
          <View className="p-3 rounded-full bg-gray-50">
            <Entypo name="plus" size={24} color={"black"} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default GridcardComponent;
