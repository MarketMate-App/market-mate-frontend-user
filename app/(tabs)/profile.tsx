import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import SwitchComponent from "../components/switch";

const ProfilePage = () => {
  type FeatherIconName =
    | "package"
    | "map-pin"
    | "credit-card"
    | "heart"
    | "settings"
    | "help-circle"
    | "log-out"
    | "lock"
    | "feather"
    | "bell";

  const menuItems = [
    { title: "Orders", icon: "package" as FeatherIconName },
    { title: "Favourites", icon: "heart" as FeatherIconName },
  ];

  const importantItems = [
    { title: "Address", icon: "map-pin" as FeatherIconName },
    { title: "Payment Methods", icon: "credit-card" as FeatherIconName },
  ];

  const preferenceItems = [
    { title: "Settings", icon: "settings" as FeatherIconName },
    { title: "Help & Support", icon: "help-circle" as FeatherIconName },
    { title: "Log Out", icon: "log-out" as FeatherIconName },
  ];

  const securityItems = [
    {
      title: "Allow Push Notifications",
      icon: "bell" as FeatherIconName,
      type: "toggle",
    },
    {
      title: "Enable Biometrics",
      icon: "lock" as FeatherIconName,
      type: "toggle",
    },
    {
      title: "Set PIN Code",
      icon: "feather" as FeatherIconName,
      type: "navigate",
    },
  ];

  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({
    "Allow Push Notifications": false,
    "Enable Biometrics": false,
  });

  const handleToggle = (title: string) => {
    setToggleStates((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }));
  };

  const ItemList = ({
    items,
    isSecurity = false,
  }: {
    items: { title: string; icon: FeatherIconName; type?: string }[];
    isSecurity?: boolean;
  }) => (
    <View className="bg-gray-50 p-3 mb-8 w-full rounded-2xl border-hairline border-gray-200">
      {items.map((item, index) => (
        <Pressable
          key={index}
          className={`flex-row justify-between items-center p-3 ${
            index === items.length - 1
              ? ""
              : "border-b-hairline border-b-gray-200"
          }`}
          onPress={() =>
            isSecurity && item.type === "navigate" && handleToggle(item.title)
          }
        >
          <View className="flex-row justify-center items-center gap-2">
            <Feather
              name={item.icon}
              size={20}
              color={"gray"}
              className="p-2 bg-white rounded-2xl"
            />
            <Text style={style.fontLight} className="text-sm text-gray-600">
              {item.title}
            </Text>
          </View>
          {isSecurity && item.type === "toggle" ? (
            <SwitchComponent
              value={toggleStates[item.title]}
              onValueChange={() => handleToggle(item.title)}
            />
          ) : (
            <AntDesign name="swapright" size={24} color={"gray"} />
          )}
        </Pressable>
      ))}
    </View>
  );
  return (
    <SafeAreaView>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center bg-white p-3">
          <Image
            source={require("@/assets/images/avatar.jpg")}
            className="w-24 h-24 mb-8 mt-8 rounded-full"
          />
          <Text
            className="text-xl mb-2"
            style={{ fontFamily: "Unbounded Regular" }}
          >
            Coffestories
          </Text>
          <Text
            className="text-sm text-gray-500 mb-4"
            style={{ fontFamily: "Unbounded Light" }}
          >
            mark.brock@icloud.com
          </Text>

          <Pressable className="py-5 w-[56%] rounded-full mb-8 border-hairline border-[#014E3C]">
            <Text
              className="text-[#014E3C] text-xs text-center"
              style={{ fontFamily: "Unbounded SemiBold" }}
            >
              Edit Profile
            </Text>
          </Pressable>

          <Text
            className="text-right text-xs text-gray-500 mb-2"
            style={{ fontFamily: "Unbounded Light" }}
          >
            My Account
          </Text>
          <ItemList items={menuItems} />

          <Text
            className="text-right text-xs text-gray-500 mb-2"
            style={{ fontFamily: "Unbounded Light" }}
          >
            Address & Payment
          </Text>
          <ItemList items={importantItems} />

          <Text
            className="text-right text-xs text-gray-500 mb-2"
            style={{ fontFamily: "Unbounded Light" }}
          >
            Security
          </Text>
          <ItemList items={securityItems} isSecurity />

          <Text
            className="text-right text-xs text-gray-500 mb-2"
            style={{ fontFamily: "Unbounded Light" }}
          >
            Preference
          </Text>
          <ItemList items={preferenceItems} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  fontRegular: {
    fontFamily: "Unbounded Regular",
  },
  fontLight: {
    fontFamily: "Unbounded Light",
  },
});

export default ProfilePage;
