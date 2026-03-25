/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import car from "../../../assets/car.png";
import bike from "../../../assets/bike.png";
import StoreClosedModal from "../../../components/StoreClosedModal";
import { isStoreOpen } from "../../../helpers/StoreHours";
import { CheckOutCart } from "../../../helpers/Backend";
import { useAppSelector } from "../../../redux/Hooks";
import Loader from "../../../components/ProductLoader";

const Bookaslot = ({ navigation }) => {
  const [showClosedModal, setShowClosedModal] = useState(false);
  const cart = useAppSelector((state) => state.bag.value);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isStoreOpen()) {
      setShowClosedModal(true);
    }
  }, []);

  const CheckOut = (type) => {
    const products = [];
    const deals = [];

    cart.forEach((item) => {
      if (item.item_type === "deal") {
        deals.push({
          dealId: item.deal_id,
          quantity: item.qty,
        });
      } else {
        products.push({
          pId: item.product_id,
          quantity: item.qty,
        });
      }
    });

    setLoading(true);
    CheckOutCart({
      products,
      deals,
      delivery_type: type,
    })
      .then((res) => {
        setLoading(false);
        navigation.navigate("SlotBooked", {
          type,
          bag: res,
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>How would you like to get your order?</Text>
      <View>
        <TouchableOpacity
          onPress={() => CheckOut("homedelivery")}
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
          onPress={() => CheckOut("Pickup")}
        >
          <View style={styles.typeContainer}>
            <Image
              source={car}
              style={{
                width: 130,
                height: 90,
                alignItems: "center",
                tintColor: "#1946A9",
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
      <StoreClosedModal
        visible={showClosedModal}
        onClose={() => {
          setShowClosedModal(false);
          navigation.pop();
        }}
      />
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
    borderColor: "#1946A9",
    borderRadius: 50,
    padding: 20,
    justifyContent: "center",
    marginTop: 20,
    alignItems: "center",
  },
});

export default Bookaslot;
