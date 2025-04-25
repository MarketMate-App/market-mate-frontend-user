import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import React from "react";

const CategoriesComponent = () => {
  const categories = [
    "fruits",
    "vegetables",
    "meat",
    "fish",
    "dairy",
    "bakery",
    "beverages",
    "snacks",
    "frozen",
    "canned",
    "cleaning",
    "personal care",
    "baby",
    "pets",
  ];
  return (
    <SafeAreaView className="flex-1">
      <View className="bg-white">
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-4"
        >
          <View>
            <Image
              source={require("@/assets/images/orange.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Fruits</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/tomato.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Veggies</Text>
          </View>

          <View>
            <Image
              source={require("@/assets/images/meat.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Meat</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/fish.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Fish</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/beverage.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Beverages</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/meat.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Meat</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/meat.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Meat</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/meat.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Meat</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/meat.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Meat</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/meat.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Meat</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/meat.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Meat</Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/meat.png")}
              className="items-center justify-center w-[45px] h-[45px] mr-6 mb-1"
            />
            <Text style={style.font}>Meat</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  parent: {
    width: 80,
  },
  font: {
    fontSize: 11,
    fontFamily: "WorkSans Light",
    color: "#333",
  },
});
export default CategoriesComponent;
