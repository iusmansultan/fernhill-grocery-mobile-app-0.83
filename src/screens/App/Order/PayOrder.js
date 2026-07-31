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
  Modal,
  Dimensions,
  Platform,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { reset as resetCart } from "../../../redux/bag/BagSlice";
import { AddOrder } from "../../../helpers/Backend";
import { queryClient } from "../../../api/queryClient";
import { queryKeys } from "../../../api/queryKeys";
import Toast from "react-native-simple-toast";
import { ActivityIndicator } from "react-native-paper";
import { LIVE_CRIDENTIALS } from "../../../helpers/Config";
import { WebView } from "react-native-webview";

import axios from "axios";
import {
  AccessCheckoutTextInput,
  CARD,
  useAccessCheckout,
  useCardConfig,
} from "@worldpay/access-worldpay-checkout-react-native-sdk";
import { baseUrl } from "../../../helpers/Config";

const BACKEND_URL = baseUrl;
const DDC_TIMEOUT_MS = 10000;

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
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const [panValid, setPanValid] = useState(false);
  const [expiryValid, setExpiryValid] = useState(false);
  const [cvcValid, setCvcValid] = useState(false);

  const [ddcUri, setDdcUri] = useState(null);
  const [challengeUri, setChallengeUri] = useState(null);

  const ddcResolverRef = useRef(null);
  const challengeResolverRef = useRef(null);
  const ddcTimeoutRef = useRef(null);

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
      panId: "panInput",
      expiryDateId: "expiryDateInput",
      cvcId: "cvcInput",
      validationConfig: {
        enablePanFormatting: true,
        validationListener: cardValidationListener,
      },
    }),
  });

  const cardDetailsComplete = panValid && expiryValid && cvcValid;

  const initialiseValidationRef = useRef(initialiseValidation);
  initialiseValidationRef.current = initialiseValidation;

  useEffect(() => {
    let cancelled = false;
    let attempt = 0;
    const maxAttempts = 5;

    const tryInit = () => {
      if (cancelled) return;
      initialiseValidationRef.current().catch((err) => {
        const msg = String(err?.message || err || "");
        const notReady =
          msg.includes("Failed to find PanTextField") || msg.includes("nativeID");
        if (notReady && attempt < maxAttempts) {
          attempt += 1;
          setTimeout(tryInit, 120);
        } else if (notReady) {
          console.warn(
            "Worldpay card validation init failed (native fields not registered yet):",
            err
          );
        } else {
          console.warn("Worldpay card validation init failed:", err);
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
      if (ddcTimeoutRef.current) {
        clearTimeout(ddcTimeoutRef.current);
      }
    };
  }, []);

  const buildDeviceData = () => {
    const { width, height } = Dimensions.get("window");
    return {
      acceptHeader: "text/html",
      userAgentHeader:
        Platform.OS === "ios"
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
          : "Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
      browserLanguage: "en-GB",
      browserScreenHeight: Math.round(height),
      browserScreenWidth: Math.round(width),
      browserJavaEnabled: false,
      browserColorDepth: "32",
      timeZone: String(new Date().getTimezoneOffset()),
      browserJavascriptEnabled: true,
      channel: "browser",
    };
  };

  const buildCustomer = () => {
    const userData = user?.userData || {};
    const fullName = String(userData.name || userData.full_name || "").trim();
    const [firstName, ...rest] = fullName.split(" ").filter(Boolean);
    // Worldpay requires phone to be numeric only (no +, spaces, or dashes).
    const rawPhone = String(userData.phone || userData.mobile || "").trim();
    const phone = rawPhone.replace(/\D/g, "") || undefined;
    return {
      firstName: firstName || undefined,
      lastName: rest.length ? rest.join(" ") : undefined,
      email: userData.email || undefined,
      phone,
    };
  };

  const clearDdc = (collectionReference = null) => {
    if (ddcTimeoutRef.current) {
      clearTimeout(ddcTimeoutRef.current);
      ddcTimeoutRef.current = null;
    }
    setDdcUri(null);
    if (ddcResolverRef.current) {
      ddcResolverRef.current(collectionReference);
      ddcResolverRef.current = null;
    }
  };

  const clearChallenge = (completed = false) => {
    setChallengeUri(null);
    if (challengeResolverRef.current) {
      challengeResolverRef.current(completed);
      challengeResolverRef.current = null;
    }
  };

  const runDeviceDataCollection = (deviceDataCollection) =>
    new Promise((resolve) => {
      if (!deviceDataCollection?.jwt || !deviceDataCollection?.url) {
        resolve(null);
        return;
      }

      const params = new URLSearchParams({
        jwt: deviceDataCollection.jwt,
        bin: deviceDataCollection.bin || "",
        url: deviceDataCollection.url,
      });

      ddcResolverRef.current = resolve;
      setDdcUri(`${BACKEND_URL}/payment/3ds/ddc?${params.toString()}`);

      ddcTimeoutRef.current = setTimeout(() => {
        clearDdc(null);
      }, DDC_TIMEOUT_MS);
    });

  const runChallenge = (challenge) =>
    new Promise((resolve) => {
      if (!challenge?.jwt || !challenge?.url) {
        resolve(false);
        return;
      }

      const params = new URLSearchParams({
        jwt: challenge.jwt,
        url: challenge.url,
      });

      challengeResolverRef.current = resolve;
      setChallengeUri(`${BACKEND_URL}/payment/3ds/challenge?${params.toString()}`);
    });

  const finalizeSuccessfulPayment = (paymentData) => {
    setPaymentStatus("success");
    CreateUserOrder(paymentData.transactionReference);
  };

  const handleThreeDSFlow = async (paymentData) => {
    let current = paymentData;

    if (current.requires3ds && current.deviceDataCollection) {
      const collectionReference = await runDeviceDataCollection(
        current.deviceDataCollection
      );

      const supplyHref = current.actions?.supply3dsDeviceData?.href;
      if (!supplyHref) {
        throw new Error("Missing supply3dsDeviceData action from Worldpay");
      }

      const supplyResponse = await axios.post(
        `${BACKEND_URL}/payment/supply-3ds-device-data`,
        {
          actionHref: supplyHref,
          collectionReference: collectionReference || undefined,
        }
      );
      current = supplyResponse.data;
    }

    if (current.success) {
      finalizeSuccessfulPayment(current);
      return;
    }

    if (current.requires3dsChallenge && current.challenge) {
      const completed = await runChallenge(current.challenge);
      if (!completed) {
        throw new Error("3DS challenge was cancelled or failed");
      }

      const completeHref = current.actions?.complete3dsChallenge?.href;
      if (!completeHref) {
        throw new Error("Missing complete3dsChallenge action from Worldpay");
      }

      const completeResponse = await axios.post(
        `${BACKEND_URL}/payment/complete-3ds-challenge`,
        { actionHref: completeHref }
      );
      current = completeResponse.data;
    }

    if (current.success) {
      finalizeSuccessfulPayment(current);
      return;
    }

    throw new Error(
      current.message ||
        current.refusalDescription ||
        `Payment failed with outcome: ${current.outcome || "unknown"}`
    );
  };

  const handlePayment = async () => {
    if (!cardDetailsComplete) {
      Alert.alert(
        "Card details",
        "Please enter a valid card number, expiry date, and security code."
      );
      return;
    }

    setIsLoading(true);
    setPaymentStatus(null);

    try {
      const sessions = await generateSessions([CARD]);
      const cardSession = sessions.card;

      const paymentResponse = await axios.post(
        `${BACKEND_URL}/payment/create-payment`,
        {
          session: cardSession,
          amount: bag.total_price_inclusive_tax - promodiscount.amount,
          currency: "GBP",
          returnUrl: `${BACKEND_URL}/payment/3ds/return`,
          deviceData: buildDeviceData(),
          customer: buildCustomer(),
        }
      );

      await handleThreeDSFlow(paymentResponse.data);
    } catch (error) {
      console.error("Payment failed:", error.response?.data || error.message);
      setPaymentStatus("error");
      clearDdc(null);
      clearChallenge(false);

      let errorMessage = "Payment failed. Please try again.";
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.refusalDescription) {
          errorMessage = `${errorData.refusalDescription}${
            errorData.refusalCode ? ` (${errorData.refusalCode})` : ""
          }`;
        } else if (errorData.errorName) {
          errorMessage = `${errorData.errorName}: ${errorData.message || ""}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Payment Failed", errorMessage, [{ text: "OK" }]);
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
      };
    });
    let data = {};
    let instructions;

    if (deliveryInstruction === "") {
      instructions = "No Instructions";
    } else {
      instructions = deliveryInstruction;
    }

    if (voucherCode !== "") {
      data = {
        card_id: transactionReference,
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
              vat: bag.vat,
              off_amount: bag.off_amount,
              total_price_inclusive_tax: bag.total_price_inclusive_tax,
              govt_bag_charge: bag.govt_bag_charge,
            },
          },
        },
      };
    } else {
      data = {
        card_id: transactionReference,
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
            vat: bag.vat,
            off_amount: bag.off_amount,
            total_price_inclusive_tax: bag.total_price_inclusive_tax,
            govt_bag_charge: bag.govt_bag_charge,
          },
        },
      };
    }

    AddOrder({
      ...data,
      total: bag.total_price_inclusive_tax - promodiscount.amount,
    })
      .then((res) => {
        if (res.status) {
          dispatch(resetCart());
          queryClient.setQueryData(queryKeys.cart(user.userData.id), []);
          queryClient.invalidateQueries({
            queryKey: queryKeys.cart(user.userData.id),
          });
          Toast.show("Order Placed Successfully");
          navigation.replace("Confirmation");
          setLoading(false);
        } else {
          console.log("failed", res.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const onDdcMessage = (event) => {
    try {
      const raw = event?.nativeEvent?.data;
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (data?.MessageType === "profile.completed") {
        clearDdc(data.Status ? data.SessionId || null : null);
      }
    } catch (err) {
      console.warn("Failed to parse DDC message", err);
    }
  };

  const onChallengeMessage = (event) => {
    try {
      const raw = event?.nativeEvent?.data;
      const data = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (data?.type === "challengeComplete") {
        clearChallenge(true);
      }
    } catch (err) {
      console.warn("Failed to parse challenge message", err);
    }
  };

  const onChallengeNavigation = (navState) => {
    const url = navState?.url || "";
    if (url.includes("/payment/3ds/return")) {
      clearChallenge(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20 }}>
        <View style={styles.paymentContainer}>
          <Text style={styles.title}>Payment Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Card Number</Text>
            <AccessCheckoutTextInput
              nativeID="panInput"
              placeholder="4000 0000 0000 1091"
              style={styles.accessInput}
              editable={!isLoading}
              placeholderTextColor="gray"
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
                placeholderTextColor="gray"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfInput]}>
              <Text style={styles.label}>CVC</Text>
              <AccessCheckoutTextInput
                nativeID="cvcInput"
                placeholder="123"
                style={styles.accessInput}
                editable={!isLoading}
                placeholderTextColor="gray"
              />
            </View>
          </View>
          <Text style={styles.fieldHint}>
            Expiry and CVC are validated by Worldpay; Amex CVC may be 4 digits.
          </Text>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount to Pay:</Text>
            <Text style={styles.amountValue}>
              {"£"}
              {(
                bag.total_price_inclusive_tax - promodiscount.amount
              ).toFixed(2)}
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

          {paymentStatus === "success" && (
            <View style={styles.statusContainer}>
              <Text style={styles.successText}>✓ Payment Successful</Text>
            </View>
          )}

          {paymentStatus === "error" && (
            <View style={styles.statusContainer}>
              <Text style={styles.errorText}>✗ Payment Failed</Text>
            </View>
          )}

          <Text style={styles.secureText}>
            🔒 Your payment is secured by Worldpay
          </Text>
        </View>
      </View>

      {ddcUri ? (
        <WebView
          source={{ uri: ddcUri }}
          onMessage={onDdcMessage}
          originWhitelist={["*"]}
          javaScriptEnabled
          style={styles.hiddenWebView}
          containerStyle={styles.hiddenWebView}
        />
      ) : null}

      <Modal
        visible={!!challengeUri}
        animationType="slide"
        onRequestClose={() => clearChallenge(false)}
      >
        <View style={styles.challengeContainer}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>Bank Authentication</Text>
            <TouchableOpacity onPress={() => clearChallenge(false)}>
              <Text style={styles.challengeCancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
          {challengeUri ? (
            <WebView
              source={{ uri: challengeUri }}
              onMessage={onChallengeMessage}
              onNavigationStateChange={onChallengeNavigation}
              originWhitelist={["*"]}
              javaScriptEnabled
              startInLoadingState
              renderLoading={() => (
                <View style={styles.challengeLoading}>
                  <ActivityIndicator color="#1946A9" />
                </View>
              )}
              style={styles.challengeWebView}
            />
          ) : null}
        </View>
      </Modal>

      {(loading || isLoading) && !challengeUri ? (
        <View style={styles.overlayLoading} pointerEvents="none">
          <ActivityIndicator size="large" color="#1946A9" />
        </View>
      ) : null}
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
  paymentContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  fieldHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    lineHeight: 16,
  },
  accessInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
    height: 50,
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
    fontStyle: "normal",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  amountValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1946A9",
  },
  payButton: {
    backgroundColor: "#1946A9",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    alignItems: "center",
    shadowColor: "#1946A9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    backgroundColor: "#99c2db",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  statusContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  successText: {
    color: "#28a745",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "600",
  },
  secureText: {
    textAlign: "center",
    marginTop: 20,
    color: "#666",
    fontSize: 12,
  },
  hiddenWebView: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0.01,
  },
  challengeContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 54 : 24,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  challengeCancel: {
    fontSize: 15,
    color: "#1946A9",
    fontWeight: "600",
  },
  challengeWebView: {
    flex: 1,
  },
  challengeLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  overlayLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
});

export default PayOrder;
