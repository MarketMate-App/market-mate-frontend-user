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
import React, { useEffect, useState } from "react";
import { AntDesign, Feather } from "@expo/vector-icons";
import SwitchComponent from "../components/switch";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import UserAvatar from "../components/userAvatar";

const ProfilePage = () => {
  const [user, setUser] = useState<{
    profilePicture: any;
    fullName: string;
    phoneNumber: string;
  }>({
    profilePicture: null,
    fullName: "",
    phoneNumber: "",
  });
  const [token, setToken] = useState("");
  const fetchToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwtToken");
      if (token) {
        setToken(token);
        console.log("Token fetched:", token);
      } else {
        console.log("No token found");
      }
    } catch (error) {
      console.error("Failed to fetch token from secure storage", error);
    }
  };

  const [phoneNumber, setPhoneNumber] = useState("");
  const fetchUserDetails = async () => {
    try {
      const userDetails = await AsyncStorage.getItem("@userDetails");
      const phone = await AsyncStorage.getItem("@phoneNumber");
      if (phone) {
        setPhoneNumber(phone);
        console.log("Phone number fetched:", phone);
      }
      const parsedDetails = userDetails ? JSON.parse(userDetails) : {};
      setUser({
        profilePicture: parsedDetails.profilePicture || null,
        fullName: parsedDetails.fullName?.trim() || "Valued Shopper",
        phoneNumber:
          parsedDetails.phoneNumber?.trim() || "Phone number not available",
      });
      console.log("User details fetched:", parsedDetails);
    } catch (error) {
      console.error("Failed to fetch user details from local storage", error);
    }
  };

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
    // {
    //   title: "Settings",
    //   icon: "settings" as FeatherIconName,
    //   navigateTo: "SettingsScreen",
    // },
    // {
    //   title: "Help & Support",
    //   icon: "help-circle" as FeatherIconName,
    //   navigateTo: "HelpSupportScreen",
    // },
    {
      title: "Log Out",
      icon: "log-out" as FeatherIconName,
      navigateTo: "logout", // or implement logout logic in navigation callback
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
                router.replace(item.navigateTo as any);
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
  useEffect(() => {
    fetchToken();
    fetchUserDetails();
  }, []);
  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        horizontal={false}
        showsVerticalScrollIndicator={false}
        className="bg-[#ffffff90]"
      >
        {token ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              backgroundColor: "#FFF",
              padding: 12,
            }}
          >
            <View className="mb-8 mt-8 flex-row items-center justify-center">
              <UserAvatar
                name={user.fullName}
                size={120}
                imageUrl={user?.profilePicture}
              />
            </View>
            <Text
              style={[
                { marginBottom: 8, fontSize: 20 },
                { fontFamily: "Unbounded Regular" },
              ]}
            >
              {user.fullName}
            </Text>
            <Text
              style={[
                { marginBottom: 16, fontSize: 14, color: "#6B7280" },
                { fontFamily: "Unbounded Light" },
              ]}
            >
              {phoneNumber}
            </Text>
            <TouchableOpacity
              onPressIn={() => {
                router.push("/screens/delivery_address");
              }}
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
                className="text-xs"
                style={[
                  { textAlign: "center", color: "#014E3C" },
                  { fontFamily: "Unbounded SemiBold" },
                ]}
              >
                Edit Profile
              </Text>
            </TouchableOpacity>
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
            {/* <Text
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
            <ItemList items={securityItems} isSecurity /> */}
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
        ) : (
          <View className="p-4 flex-1 bg-white">
            <Text
              className="text-3xl mb-3"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Welcome Back!
            </Text>
            <Text
              className="text-gray-500 text-xs mb-8"
              style={{ fontFamily: "Unbounded Regular" }}
            >
              Log in to unlock your personalized experience, manage your orders,
              and access exclusive features tailored just for you.
            </Text>

            <TouchableOpacity
              onPressIn={() => {
                router.push("/auth");
              }}
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
                className="text-xs"
                style={[
                  { textAlign: "center", color: "#014E3C" },
                  { fontFamily: "Unbounded SemiBold" },
                ]}
              >
                Continue to Login
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
