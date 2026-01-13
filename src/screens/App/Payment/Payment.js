import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Button,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";

import { useAppSelector, useAppDispatch } from "../../../redux/Hooks";
import { saveUser } from "../../../redux/auth/AuthSlice";
import visa from "../../../assets/visa.png";
import master from "../../../assets/mastercard.png";
import arrowIcon from "../../../assets/arrowIcon.png";
// import {
//   CardField,
//   CardForm,
//   useStripe,
//   useConfirmSetupIntent,
// } from "@stripe/stripe-react-native";
// import { StripeProvider } from "@stripe/stripe-react-native";
import {
  GetSetupIntent,
  GetSignedUserDetails,
  DeleteUserCard,
} from "../../../helpers/Backend";
import { ActivityIndicator } from "react-native-paper";
import Loader from "../../../components/ProductLoader";
import ccard from "../../../assets/ccard.png";
import Toast from "react-native-simple-toast";

const Payments = () => {
  const user = useAppSelector((state) => state.user.value);
  const [cards, setCards] = useState([]);
  const token = useAppSelector((state) => state.user.token);

  const [loader, setLoader] = useState(false);

  const [addCard, setAddCard] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCards(user.userData.cards_data);
  }, [user]);

  if (addCard) {
    return (
      // <StripeProvider
      //   publishableKey=""
      //   merchantIdentifier="merchant.identifier"
      // >
        <PaymentScreen setAddCard={setAddCard} />
      // </StripeProvider>
    );
  }

  if (loader) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View style={styles.paymentMethods}>
        <Text
          style={{
            color: "#0066B1",
            fontSize: 20,
            paddingBottom: 20,
            marginTop: 20,
            fontWeight: "bold",
          }}
        >
          Your Payment Methods
        </Text>

        <View style={styles.paymentMethods}>
          {cards !== [] || cards === "undefined" ? (
            cards &&
            cards.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    // borderWidth: 1.5,
                    // borderColor: '#0066B1',
                    borderRadius: 50,
                    padding: 20,
                    paddingLeft: 25,
                    paddingRight: 25,
                    backgroundColor: "#0066B1",
                    marginBottom: 10,
                  }}
                  onPress={() => {
                    Alert.alert(
                      "Confirm Delete",
                      "Do you want to delete you card",
                      [
                        {
                          text: "Cancel",
                          onPress: () => console.log("Cancel Pressed"),
                          style: "cancel",
                        },
                        {
                          text: "OK",
                          onPress: () => {
                            setLoader(true);
                            DeleteUserCard(token, item.id)
                              .then((response) => {
                                const data = {
                                  isLoggedIn: true,
                                  userData: response,
                                };
                                // console.log(data)
                                dispatch(saveUser(data));
                                setLoader(false);
                                Toast.show("Card Deleted Successfully");
                              })
                              .catch((error) => {
                                console.log(error);
                              });
                          },
                        },
                      ]
                    );

                    // Alert.alert("Confirmation", "Do you want to delete your card")
                  }}
                >
                  {item.card.brand === "mastercard" ? (
                    <Image source={master} tintColor="white" />
                  ) : (
                    <Image source={visa} tintColor="white" />
                  )}
                  <Text style={styles.selectedtext}>
                    **** **** **** {item.card.last4}
                  </Text>
                  <Image source={arrowIcon} tintColor="white" />
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={{ color: "black" }}>No Payment Methods Added Yet</Text>
          )}
          <TouchableOpacity
            onPress={() => {
              setAddCard(true);
            }}
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 50,
              padding: 20,
              backgroundColor: "#0066B1",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Add Payment Methods
            </Text>
            <Image source={arrowIcon} tintColor="white" />
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instruction: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
  token: {
    height: 20,
  },
  paymentMethods: {
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedtext: {
    color: "white",
  },
});
export default Payments;

const PaymentScreen = ({ setAddCard }) => {
  const user = useAppSelector((state) => state.user.value);
  const cards = user.userData.cards_data;
  const token = useAppSelector((state) => state.user.token);

  const [cardDetails, setCardDetails] = useState();
  const { confirmSetupIntent } = useConfirmSetupIntent();
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const dispatch = useAppDispatch();

  const AddCard = () => {
    setLoading(true);
    GetSetupIntent(token)
      .then((response) => {
        confirmSetupIntent(response.client_secret, {
          paymentMethodType: "Card",
          billingDetails: cardDetails,
        })
          .then((res) => {
            GetSignedUserDetails(token)
              .then((response) => {
                const data = {
                  isLoggedIn: true,
                  userData: response.data.data.list,
                };
                // console.log(data)
                dispatch(saveUser(data));
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
              });
            console.log(res);
            setAddCard(false);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });

    // console.log(cardDetails)
    // setAddCard(false)
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Image
        source={ccard}
        style={{ height: "40%", width: "95%", resizeMode: "contain" }}
      />
      <CardField
        postalCodeEnabled={true}
        placeholders={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={{
          backgroundColor: "#F2F2F5",
          textColor: "#0066B1",
          placeholderColor: "gray",
        }}
        style={{
          width: "100%",
          height: 50,
          marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
          // console.log('cardDetails', cardDetails);
        }}
        onFocus={(focusedField) => {
          // console.log('focusField', focusedField);
          if (focusedField === "PostalCode") {
            setShowButton(true);
          } else {
            setShowButton(false);
          }
        }}
      />
      {!showButton ? (
        <Text
          style={{
            color: "#0066B1",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          Enter Card Details
        </Text>
      ) : (
        <TouchableOpacity
          style={{
            width: "95%",
            height: 50,
            backgroundColor: "#0066B1",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 50,
          }}
          onPress={AddCard}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              style={{
                color: "white",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Add Card
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
