import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import React, { useRef } from "react";
import { useState } from "react";
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import TextRecognition from "@react-native-ml-kit/text-recognition";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const navigation = useNavigation();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePicture() {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          console.log(photo);

          // Perform OCR on the taken picture
          const result = await TextRecognition.recognize(photo.uri);

          console.log("Recognized text:", result.text);

          for (let block of result.blocks) {
            console.log("Block text:", block.text);
            console.log("Block frame:", block.frame);

            for (let line of block.lines) {
              console.log("Line text:", line.text);
              console.log("Line frame:", line.frame);
            }
          }
        } else {
          Alert.alert("Error", "Failed to take picture");
        }
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "An error occurred while taking the picture");
    }
  }

  return (
    <View className="flex-1">
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.topButtonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
        </View>
        <View
          style={styles.bottomButtonContainer}
          className="items-center justify-center"
        >
          <TouchableOpacity style={styles.button}>
            <Ionicons name="attach" size={24} color={"white"} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <MaterialIcons
              name="fiber-manual-record"
              size={60}
              color={"white"}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleCameraFacing}>
            <AntDesign
              name="reload1"
              style={styles.button}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  topButtonContainer: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.09)",
    padding: 10,
    borderRadius: 100,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
