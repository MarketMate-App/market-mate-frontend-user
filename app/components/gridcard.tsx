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
  const [quantity, setQuantity] = React.useState(0);

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
          <View>
            {quantity === 0 ? (
              <View
                className="p-3 rounded-full bg-gray-50"
                onTouchEnd={() => setQuantity(1)}
              >
                <Entypo name="plus" size={24} color={"gray"} />
              </View>
            ) : (
              <View className="flex-row items-center ">
                <Entypo
                  name="minus"
                  size={24}
                  color={"black"}
                  onPress={() => setQuantity(quantity > 0 ? quantity - 1 : 0)}
                />
                <Text className="mx-2">{quantity}</Text>
                <Entypo
                  name="plus"
                  size={24}
                  color={"black"}
                  onPress={() => setQuantity(quantity + 1)}
                />
              </View>
            )}
            {/* {quantity > 0 && (
              <Text className="text-green-500 mt-2 text-sm">Added to cart</Text>
            )} */}
          </View>
        </View>
        <View className="mt-2">
          <Text
            className="text-gray-500"
            style={{ fontFamily: "Gilroy Medium" }}
          >
            Total: ₵{(price * quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GridcardComponent;
