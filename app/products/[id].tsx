import { View, Text } from "react-native";
import React from "react";
import { Stack, useGlobalSearchParams } from "expo-router";

// TODO Make this a real page
const DetailsPage = () => {
  const { id, name } = useGlobalSearchParams();
  return (
    <View>
      <Stack.Screen options={{}} />
      <Text>
        Details Page for item with id: {id} and name: {name}
      </Text>
    </View>
  );
};

export default DetailsPage;
