/* eslint-disable react-native/no-inline-styles */
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import car from "../../../assets/car.png";
import bike from "../../../assets/bike.png";

const Bookaslot = ({ navigation, route }) => {
  const { bag } = route.params;
  console.log("BGBBGBGB", bag);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>How would you like to get your order?</Text>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SlotBooked", {
              type: "homedelivery",
              bag: bag,
            });
          }}
        >
          <View style={styles.typeContainer}>
            <Image
              source={bike}
              style={{
                width: 150,
                height: 150,
                alignItems: "center",
                justifyContent: "center",
                resizeMode: "contain",
                padding: 5,
              }}
            />

            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Home Delivery
              </Text>
              <Text
                style={{
                  color: "black",
                }}
              >
                Your online shopping delivered to your fridge door
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CheckOutSummary", {
              type: "Pickup",
              bag: bag,
            });
          }}
        >
          <View style={styles.typeContainer}>
            <Image
              source={car}
              style={{
                width: 130,
                height: 90,
                alignItems: "center",
                tintColor: "#0066B1",
              }}
            />

            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Click + Collect
              </Text>
              <Text
                style={{
                  color: "black",
                }}
              >
                Collect your shopping at your convenience.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // justifyContent: 'center',
    alignItems: "center",
    width: "100%",
    padding: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  typeContainer: {
    // width: 350,
    height: 250,
    borderWidth: 1,
    borderColor: "#0066B1",
    borderRadius: 50,
    padding: 20,
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
});

export default Bookaslot;
