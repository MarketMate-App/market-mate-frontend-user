import {
  Pressable,
  View,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
} from "react-native";
import { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
interface SwitchComponentProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
}

const SwitchComponent: React.FC<SwitchComponentProps> = (props) => {
  const { value, onValueChange } = props;
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    // Update the animated value when the value prop changes
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 300, // Adjust the animation duration
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 28], // Adjust the distance of the switch head
  });

  const toggleSwitch = () => {
    const newValue = !value;
    onValueChange(newValue);
  };

  const defaultStyles = {
    bgGradientColors: ["#0100ff", "#ff00fb"] as [string, string],
    headGradientColors: ["#ffffff", "#E1E4E8"] as [string, string],
  };

  const activeStyles = {
    bgGradientColors: ["#00c4ff", "#fff600"] as [string, string],
    headGradientColors: ["#444D56", "#0E1723"] as [string, string],
  };

  const currentStyles = value ? activeStyles : defaultStyles;

  return (
    <Pressable onPress={toggleSwitch} style={styles.pressable}>
      <LinearGradient
        colors={currentStyles.bgGradientColors}
        style={styles.backgroundGradient}
        start={{
          x: 0,
          y: 0.5,
        }}
      >
        <View style={styles.innerContainer}>
          <Animated.View
            style={{
              transform: [{ translateX }],
            }}
          >
            <LinearGradient
              colors={currentStyles.headGradientColors}
              style={styles.headGradient}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  pressable: {
    width: 56,
    height: 32,
    borderRadius: 16,
  },
  backgroundGradient: {
    borderRadius: 16,
    flex: 1,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  headGradient: {
    width: 24,
    height: 24,
    borderRadius: 100,
  },
});

export default SwitchComponent;
