import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import SwitchComponent from "../components/switch";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

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

  // Updated navigation links for items
  const menuItems = [
    {
      title: "Orders",
      icon: "package" as FeatherIconName,
      navigateTo: "/screens/userOrders",
    },
    {
      title: "Favourites",
      icon: "heart" as FeatherIconName,
      navigateTo: "Favourites",
    },
  ];

  const importantItems = [
    {
      title: "Address",
      icon: "map-pin" as FeatherIconName,
      navigateTo: "AddressScreen",
    },
    {
      title: "Payment Methods",
      icon: "credit-card" as FeatherIconName,
      navigateTo: "PaymentMethodsScreen",
    },
  ];

  const preferenceItems = [
    {
      title: "Settings",
      icon: "settings" as FeatherIconName,
      navigateTo: "SettingsScreen",
    },
    {
      title: "Help & Support",
      icon: "help-circle" as FeatherIconName,
      navigateTo: "HelpSupportScreen",
    },
    {
      title: "Log Out",
      icon: "log-out" as FeatherIconName,
      navigateTo: "Logout", // or implement logout logic in navigation callback
    },
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
      navigateTo: "PinCodeScreen",
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
    items: {
      title: string;
      icon: FeatherIconName;
      type?: string;
      navigateTo?: string;
    }[];
    isSecurity?: boolean;
  }) => {
    const navigation = useNavigation<any>();
    return (
      <View
        style={{
          backgroundColor: "#F9FAFB",
          padding: 12,
          marginBottom: 16,
          width: "100%",
          borderRadius: 16,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "#E5E7EB",
        }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
              borderBottomWidth:
                index === items.length - 1 ? 0 : StyleSheet.hairlineWidth,
              borderBottomColor: "#E5E7EB",
            }}
            onPress={() => {
              if (item.type === "toggle") {
                handleToggle(item.title);
              } else if (item.navigateTo) {
                router.push(item.navigateTo as any);
              }
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Feather
                name={item.icon}
                size={20}
                color={"gray"}
                style={{
                  padding: 8,
                  backgroundColor: "#FFF",
                  borderRadius: 16,
                }}
              />
              <Text
                style={[style.fontLight, { fontSize: 14, color: "#4B5563" }]}
              >
                {item.title}
              </Text>
            </View>
            {item.type === "toggle" ? (
              <SwitchComponent
                value={toggleStates[item.title]}
                onValueChange={() => handleToggle(item.title)}
              />
            ) : (
              <AntDesign name="swapright" size={24} color={"gray"} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: "#FFF",
            padding: 12,
          }}
        >
          <Image
            source={require("@/assets/images/avatar.jpg")}
            style={{
              width: 96,
              height: 96,
              marginBottom: 32,
              marginTop: 32,
              borderRadius: 999,
            }}
          />
          <Text
            style={[
              { marginBottom: 8, fontSize: 20 },
              { fontFamily: "Unbounded Regular" },
            ]}
          >
            Coffestories
          </Text>
          <Text
            style={[
              { marginBottom: 16, fontSize: 14, color: "#6B7280" },
              { fontFamily: "Unbounded Light" },
            ]}
          >
            mark.brock@icloud.com
          </Text>

          <Pressable
            style={{
              paddingVertical: 20,
              width: "56%",
              borderRadius: 999,
              marginBottom: 32,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: "#014E3C",
            }}
          >
            <Text
              style={[
                { textAlign: "center", fontSize: 12, color: "#014E3C" },
                { fontFamily: "Unbounded SemiBold" },
              ]}
            >
              Edit Profile
            </Text>
          </Pressable>

          <Text
            style={[
              {
                textAlign: "right",
                fontSize: 10,
                color: "#6B7280",
                marginBottom: 8,
              },
              { fontFamily: "Unbounded Light" },
            ]}
          >
            My Account
          </Text>
          <ItemList items={menuItems} />

          <Text
            style={[
              {
                textAlign: "right",
                fontSize: 10,
                color: "#6B7280",
                marginBottom: 8,
              },
              { fontFamily: "Unbounded Light" },
            ]}
          >
            Address & Payment
          </Text>
          <ItemList items={importantItems} />

          <Text
            style={[
              {
                textAlign: "right",
                fontSize: 10,
                color: "#6B7280",
                marginBottom: 8,
              },
              { fontFamily: "Unbounded Light" },
            ]}
          >
            Security
          </Text>
          <ItemList items={securityItems} isSecurity />

          <Text
            style={[
              {
                textAlign: "right",
                fontSize: 10,
                color: "#6B7280",
                marginBottom: 8,
              },
              { fontFamily: "Unbounded Light" },
            ]}
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
