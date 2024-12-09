import { View, Text, TextInput } from "react-native";
import React from "react";

const SearchPage = () => {
  return (
    <View>
      <TextInput
        placeholder="Search.."
        clearButtonMode="always"
        className="px-6 py-4 border-gray-100 sticky rounded-lg"
        style={styles.search}
      />{" "}
    </View>
  );
};
const styles = StyleSheet.create({
  search: {
    borderColor: "lightgray",
    backgroundColor: "transparent",
    borderWidth: 1.5,
  },
});
export default SearchPage;
