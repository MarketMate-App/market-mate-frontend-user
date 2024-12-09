import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const ProfilePage = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Link href={"/"} asChild>
        <Text className="text-3xl color-slate-500">Go to register</Text>
      </Link>
    </View>
  );
};

export default ProfilePage;
