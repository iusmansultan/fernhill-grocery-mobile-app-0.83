/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  InteractionManager,
} from "react-native";
import { useAppSelector } from "../../../redux/Hooks";
import { AddOrder } from "../../../helpers/Backend";
import Toast from "react-native-simple-toast";
import { ActivityIndicator } from "react-native-paper";
import { LIVE_CRIDENTIALS } from "../../../helpers/Config";

import axios from 'axios';
import {
  AccessCheckoutTextInput,
  CARD,
  useAccessCheckout,
  useCardConfig,
} from '@worldpay/access-worldpay-checkout-react-native-sdk';
import { baseUrl } from "../../../helpers/Config";

const BACKEND_URL = baseUrl; // 

const PayOrder = ({ navigation, route }) => {
  const {
    bag,
    addressId,
    date,
    time,
    deliveryInstruction,
    type,
    voucherCode,
    promodiscount,
    address,
  } = route.params;
  const user = useAppSelector((state) => state.user.value);
  const [loading, setLoading] = useState(false);
  // const totalPayment = bag.totalPriceInclusiveTax - promodiscount;

  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  /** Worldpay SDK validation (PAN / expiry / CVC) — inputs stay tokenized; we only get validity flags. */
  const [panValid, setPanValid] = useState(false);
  const [expiryValid, setExpiryValid] = useState(false);
  const [cvcValid, setCvcValid] = useState(false);

  const cardValidationListener = useMemo(
    () => ({
      onPanValidChanged: (isValid) => setPanValid(!!isValid),
      onExpiryDateValidChanged: (isValid) => setExpiryValid(!!isValid),
      onCvcValidChanged: (isValid) => setCvcValid(!!isValid),
    }),
    []
  );
  const { generateSessions, initialiseValidation } = useAccessCheckout({
    baseUrl: LIVE_CRIDENTIALS.baseUrl,
    checkoutId: LIVE_CRIDENTIALS.checkoutId,
    config: useCardConfig({
      panId: 'panInput',
      expiryDateId: 'expiryDateInput',
      cvcId: 'cvcInput',
      validationConfig: {
        enablePanFormatting: true,
        validationListener: cardValidationListener,
      },
    }),
  });

  const cardDetailsComplete = panValid && expiryValid && cvcValid;

  const initialiseValidationRef = useRef(initialiseValidation);
  initialiseValidationRef.current = initialiseValidation;

  // Native PAN/expiry/CVC fields must call registerView() before initialiseValidation().
  // That happens in AccessCheckoutTextInput's useEffect — run init after layout + next frame(s).
  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 5;

    const tryInit = () => {
      if (cancelled) return;
      initialiseValidationRef.current().catch((err) => {
        const msg = String(err?.message || err || '');
        const notReady =
          msg.includes('Failed to find Pan TextField') ||
          msg.includes('nativeID');
        if (notReady && attempt < maxAttempts) {
          attempt += 1;
          setTimeout(tryInit, 120);
        } else if (notReady) {
          console.warn(
            'Worldpay card validation init failed (native fields not registered yet):',
            err
          );
        } else {
          console.warn('Worldpay card validation init failed:', err);
        }
      });
    };

    const task = InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        requestAnimationFrame(tryInit);
      });
    });

    return () => {
      cancelled = true;
      task.cancel();
    };
  }, []);

  const handlePayment = async () => {
    if (!cardDetailsComplete) {
      Alert.alert(
        'Card details',
        'Please enter a valid card number, expiry date, and security code.'
      );
      return;
    }

    setIsLoading(true);
    setPaymentStatus(null);

    try {
      const sessionTypes = [CARD];

      console.log('handlePayment', sessionTypes)

      // Step 1: Generate a secure session from card details using Worldpay SDK
      // This keeps card data secure and PCI compliant - card details never touch your server
      const sessions = await generateSessions(sessionTypes);
      console.log('sessions', sessions)
      const cardSession = sessions.card;

      console.log('Card session generated:', cardSession);

      let paymentResponse;

      if (BACKEND_URL) {
        // Production flow: Send the session to your backend to process the payment
        paymentResponse = await axios.post(
          `${BACKEND_URL}/payment/create-payment`,
          {
            session: cardSession,
            amount: bag.total_price_inclusive_tax - promodiscount.amount,
            currency: "GBP",
          }
        );
      }

      console.log('Payment success:', paymentResponse.data);
      setPaymentStatus('success');

      // Alert.alert(
      //   'Payment Successful',
      //   `Payment authorized! Reference: ${paymentResponse.data.transactionReference || 'N/A'}`,
      //   [{ text: 'OK' }]
      // );
      CreateUserOrder(paymentResponse.data.transactionReference);

    } catch (error) {
      console.error('Payment failed:', error.response?.data || error.message);
      setPaymentStatus('error');

      // Extract detailed error message from Worldpay response
      let errorMessage = 'Payment failed. Please try again.';
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.errorName) {
          errorMessage = `${errorData.errorName}: ${errorData.message || ''}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert(
        'Payment Failed',
        errorMessage,
        [{ text: 'OK' }]
      );

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.userData.cards_data === null) {
      navigation.navigate("Payment");
    }
  }, []);


  const CreateUserOrder = (transactionReference) => {
    console.log("bag", bag);
    setLoading(true);

    const products = bag.products.map((item) => {
      console.log("Item++++>", item);
      return {
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        thumb: item.thumb,
      };
    });
    const deals = bag.deals.map((item) => {
      return {
        products: item.products,
        quantity: item.quantity,
        price: item.deal_price,
        name: item.name,
        thumb: item.thumb,
      }
    })
    let data = {};
    let instructions;

    if (deliveryInstruction === "") {
      instructions = "No Instructions";
    } else {
      instructions = deliveryInstruction;
    }

    if (voucherCode !== "") {
      data = {
        card_id: transactionReference, //?TODO
        currency: "GBP",
        products: products,
        deals: deals,
        user_id: user.userData.id,
        promo_code: voucherCode,
        delivery_type:
          type === "homedelivery" ? "HOME_DELIVERY" : "SELF_PICKUP",
        delivery_details: {
          delivery_date: date,
          delivery_time: time,
          address_id: addressId,
          delivery_details: {
            delivery_date: date,
            delivery_time: time,
            address_id: addressId,
            address: address,
            delivery_instructions: instructions,
            others: {
              delivery_charges: bag.delivery_charges,
              total_price: bag.total_price,
              sales_tax: bag.sales_tax,
              total_price_inclusive_tax: bag.total_price_inclusive_tax,
              govt_bag_charge: bag.govt_bag_charge,
            },
          },
        },
      };
    } else {
      data = {
        card_id: transactionReference, //?TODO
        currency: "GBP",
        products: products,
        deals: deals,
        user_id: user.userData.id,
        delivery_type:
          type === "homedelivery" ? "HOME_DELIVERY" : "SELF_PICKUP",
        delivery_details: {
          delivery_date: date,
          delivery_time: time,
          address_id: addressId,
          address: address,
          delivery_instructions: instructions,
          others: {
            delivery_charges: bag.delivery_charges,
            total_price: bag.total_price,
            sales_tax: bag.sales_tax,
            total_price_inclusive_tax: bag.total_price_inclusive_tax,
            govt_bag_charge: bag.govt_bag_charge,
          },
        },
      };
    }

    console.log("Data++++>", data);

    AddOrder({
      ...data,
      total: bag.total_price_inclusive_tax - promodiscount.amount,
    })
      .then((res) => {
        if (res.status) {
          Toast.show("Order Placed Successfully");
          navigation.replace("Confirmation");
          setLoading(false);
        } else {
          console.log("failed", res.message);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 20,
        }}
      >

        <View style={styles.paymentContainer}>
          <Text style={styles.title}>Payment Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Number</Text>
            <AccessCheckoutTextInput
              nativeID="panInput"
              placeholder="4000 0000 0000 1091"
              style={styles.accessInput}
              editable={!isLoading}
              placeholderTextColor='gray'
            />
            <Text style={styles.fieldHint}>
              Spaces are added automatically (groups of 4 digits).
            </Text>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>Expiry Date</Text>
              <AccessCheckoutTextInput
                nativeID="expiryDateInput"
                placeholder="MM/YY"
                style={styles.accessInput}
                editable={!isLoading}
                placeholderTextColor='gray'
              />
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>CVC</Text>
              <AccessCheckoutTextInput
                nativeID="cvcInput"
                placeholder="123"
                style={styles.accessInput}
                editable={!isLoading}
                placeholderTextColor='gray'
              />
            </View>
          </View>
          <Text style={styles.fieldHint}>
            Expiry and CVC are validated by Worldpay; Amex CVC may be 4 digits.
          </Text>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount to Pay:</Text>
            <Text style={styles.amountValue}>
              {"£"}{((bag.total_price_inclusive_tax - promodiscount.amount)).toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.payButton,
              (isLoading || !cardDetailsComplete) && styles.payButtonDisabled,
            ]}
            onPress={handlePayment}
            disabled={isLoading || !cardDetailsComplete}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pay Now</Text>
            )}
          </TouchableOpacity>

          {paymentStatus === 'success' && (
            <View style={styles.statusContainer}>
              <Text style={styles.successText}>✓ Payment Successful</Text>
            </View>
          )}

          {paymentStatus === 'error' && (
            <View style={styles.statusContainer}>
              <Text style={styles.errorText}>✗ Payment Failed</Text>
            </View>
          )}

          <Text style={styles.secureText}>
            🔒 Your payment is secured by Worldpay
          </Text>
        </View>
      </View>
      {/* <View style={styles.bottomView}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => {
            CreateUserOrder();
          }}
        >
          <View style={styles.checkoutBtnContainer}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.checkoutBtnText}>
                Complete Order £
                {(bag.total_price_inclusive_tax - promodiscount.amount).toFixed(
                  2
                )}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
    justifyContent: "space-between",
  },
  containerInner: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentMethods: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    color: "white",
  },
  selectedtext: {
    color: "#1946A9",
  },
  bottomView: {
    width: "100%",
    // backgroundColor: 'green',
    alignItems: "center",
    marginTop: 20,
  },
  checkoutBtn: {
    width: "95%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1946A9",
    padding: 15,
    height: 60,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 50,
  },
  checkoutBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  paymentContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  fieldHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    lineHeight: 16,
  },
  accessInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
    height: 50,
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    fontStyle: 'normal',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  amountValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1946A9',
  },
  payButton: {
    backgroundColor: '#1946A9',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#1946A9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    backgroundColor: '#99c2db',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  statusContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '600',
  },
  secureText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 12,
  },
});

export default PayOrder;
