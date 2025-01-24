import React from "react";
import { StyleSheet, View, TouchableHighlight } from "react-native";
import {
  Frames,
  CardNumber,
  ExpiryDate,
  Cvv,
  SubmitButton,
} from "frames-react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Frames
        config={{
          debug: true,
          publicKey: "pk_test_4296fd52-efba-4a38-b6ce-cf0d93639d8a",
        }}
        cardTokenized={(e) => {
          alert(e);
        }}
      >
        <CardNumber
          style={styles.cardNumber}
          placeholderTextColor="#9898A0"
          // showIcon={false} in case you don't want to see the card scheme logo
        />

        <View style={styles.dateAndCode}>
          <ExpiryDate
            style={styles.expiryDate}
            placeholderTextColor="#9898A0"
          />
          <Cvv style={styles.cvv} placeholderTextColor="#9898A0" />
        </View>

        <SubmitButton
          title="Pay Now"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => console.log("merchant action")}
        />
      </Frames>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingLeft: 10,
    paddingRight: 10,
  },
  dateAndCode: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardNumber: {
    fontSize: 18,
    height: 50,
    color: "#FEFFFF",
    backgroundColor: "#1B1C1E",
    borderColor: "#3A4452",
    borderRadius: 5,
    borderWidth: 0,
  },
  expiryDate: {
    fontSize: 18,
    height: 50,
    width: "48%",
    color: "#FEFFFF",
    backgroundColor: "#1B1C1E",
    borderWidth: 0,
  },
  cvv: {
    fontSize: 18,
    height: 50,
    width: "48%",
    color: "#FEFFFF",
    backgroundColor: "#1B1C1E",
    borderWidth: 0,
  },
  button: {
    height: 50,
    borderRadius: 5,
    marginTop: 20,
    justifyContent: "center",
    backgroundColor: "#4285F4",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
