import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
}

const getRandomColor = () => {
  const colors = [
    { background: "#33FF57", text: "#000000" },
    { background: "#FFC300", text: "#000000" },
    { background: "#DAF7A6", text: "#000000" },
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  imageUrl,
  size = 50,
}) => {
  const { background, text } = getRandomColor();
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background,
        },
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
      ) : (
        <Text
          style={[
            styles.initials,
            { color: text, fontSize: size <= 50 ? size / 3.5 : size / 2.5 },
          ]}
        >
          {initials}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    resizeMode: "cover",
  },
  initials: {
    fontFamily: "Unbounded Regular",
  },
});

export default UserAvatar;
