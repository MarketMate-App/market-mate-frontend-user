import {
  View,
  Text,
  Alert,
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React from "react";
import { useFocusEffect } from "expo-router";
import HeaderComponent from "../components/header";
import SearchComponent from "../components/search";
import CategoriesComponent from "../components/categories";
import GridcardComponent from "../components/gridcard";

const HomePage = () => {
  const handleBackPress = () => {
    Alert.alert("Exit", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
      };
    }, [])
  );
  return (
    <SafeAreaView className="p-3 bg-white flex-1">
      <HeaderComponent />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <CategoriesComponent /> */}
        <Text className="text-xl mb-4" style={{ fontFamily: "Gilroy Bold" }}>
          Featured Fruits
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <GridcardComponent
            name={"Watermelon"}
            price={22.09}
            imageUrl={require("../../assets/images/watermelon.jpg")}
          />
          <GridcardComponent
            name={"Apple"}
            price={22.09}
            imageUrl={require("../../assets/images/apple.jpg")}
          />
          <GridcardComponent
            name={"Banana"}
            price={22.09}
            imageUrl={require("../../assets/images/banana.jpg")}
          />
          <GridcardComponent
            name={"Papaya"}
            price={22.09}
            imageUrl={require("../../assets/images/papaya.jpg")}
          />
        </ScrollView>
        <Text className="text-xl mb-4" style={{ fontFamily: "Gilroy Bold" }}>
          Fresh Veggies
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <GridcardComponent
            name={"Tomato"}
            price={22.09}
            imageUrl={require("../../assets/images/tomato.jpg")}
          />
          <GridcardComponent
            name={"Cabbage"}
            price={22.09}
            imageUrl={require("../../assets/images/cabbage.jpg")}
          />
          <GridcardComponent
            name={"Lettuce"}
            price={22.09}
            imageUrl={require("../../assets/images/lettuce.jpg")}
          />
          <GridcardComponent
            name={"Red Pepper"}
            price={22.09}
            imageUrl={require("../../assets/images/redpepper.jpg")}
          />
          <GridcardComponent
            name={"Chilli Pepper"}
            price={22.09}
            imageUrl={require("../../assets/images/chillipepper.jpg")}
          />
          <GridcardComponent
            name={"Green Pepper"}
            price={22.09}
            imageUrl={require("../../assets/images/greenpepper.jpg")}
          />
        </ScrollView>
        <Text className="text-xl mb-4" style={{ fontFamily: "Gilroy Bold" }}>
          Grossing Meats
        </Text>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <GridcardComponent
            name={"Chicken"}
            price={22.09}
            imageUrl={require("../../assets/images/chicken.jpg")}
          />
          <GridcardComponent
            name={"Cow Beef"}
            price={22.09}
            imageUrl={require("../../assets/images/beef.jpg")}
          />
          <GridcardComponent
            name={"Pork"}
            price={22.09}
            imageUrl={require("../../assets/images/pork.jpg")}
          />
          <GridcardComponent
            name={"Mutton"}
            price={22.09}
            imageUrl={require("../../assets/images/mutton.jpg")}
          />
        </ScrollView>
        <CategoriesComponent />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
