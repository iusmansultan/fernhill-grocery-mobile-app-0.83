/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {VerifyPromoCode} from '../../../helpers/Backend';
import {useAppSelector} from '../../../redux/Hooks';
import {ActivityIndicator} from 'react-native-paper';

const Checkoutsummary = ({navigation, route}) => {
  const token = useAppSelector(state => state.user.token);
  const {type, address, date, time, deliveryInstruction, bag, addressId} =
    route.params;
  console.log ("**************************************", address, addressId)
  console.log(bag, "bag");
  console.log ("**************************************")
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [dt, setDt] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [promoError, setPromoError] = useState({
    status: false,
    message: '',
  });
  const [promodiscount, setPromoDiscount] = useState({
    amount: 0,
  });

  useEffect(() => {
    let d;
    if (type === 'Pickup') {
      d = new Date();
    } else {
      d = new Date(date);
    }
    if (d.getDay() === 0) {
      setDay('Sun');
    } else if (d.getDay() === 1) {
      setDay('Mon');
    } else if (d.getDay() === 2) {
      setDay('Tue');
    } else if (d.getDay() === 3) {
      setDay('Wed');
    } else if (d.getDay() === 4) {
      setDay('Thu');
    } else if (d.getDay() === 5) {
      setDay('Fri');
    } else if (d.getDay() === 6) {
      setDay('Sat');
    } else {
      setDay('Sun');
    }

    if (d.getMonth() === 0) {
      setMonth('Jan');
    } else if (d.getMonth() === 1) {
      setMonth('Feb');
    } else if (d.getMonth() === 2) {
      setMonth('Mar');
    } else if (d.getMonth() === 3) {
      setMonth('Apr');
    } else if (d.getMonth() === 4) {
      setMonth('May');
    } else if (d.getMonth() === 5) {
      setMonth('Jun');
    } else if (d.getMonth() === 6) {
      setMonth('Jul');
    } else if (d.getMonth() === 7) {
      setMonth('Aug');
    } else if (d.getMonth() === 8) {
      setMonth('Sep');
    } else if (d.getMonth() === 9) {
      setMonth('Oct');
    } else if (d.getMonth() === 10) {
      setMonth('Nov');
    } else if (d.getMonth() === 11) {
      setMonth('Dec');
    } else {
      setMonth('Jan');
    }

    setDt(d.getDate().toString());
  }, []);
  const applyVoucher = () => {
    if (voucherCode !== '') {
      const voucher = {
        promo_code: voucherCode,
        amount: bag.totalPriceInclusiveTax,
      };
      setLoading(true);
      VerifyPromoCode(token, voucher)
        .then(res => {
          if (res.data !== undefined) {
            const data = res.data.data;
            if (res.data.status) {
              setPromoDiscount(data.list);
              setPromoError({
                status: false,
                message: '',
              });
              setLoading(false);
            } else {
              setVoucherCode('');
              setLoading(false);
              setPromoError({
                status: true,
                message: data.message,
              });
            }
          } else {
            setVoucherCode('');
            setLoading(false);
            setPromoError({
              status: true,
              message: 'You cannot use this code anymore',
            });
          }
        })
        .catch(err => {
          console.log(err);
          setLoading(false);
          setPromoError({
            status: true,
            message: 'Promo code is not valid',
          });
        });
    } else {
      Alert.alert('Please enter promo code');
    }
  };
  if (type === 'Pickup') {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10,
              width: "100%",
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{ color: "#0066B1", fontWeight: "bold", fontSize: 20 }}
              >
                Delivery Details
              </Text>
              <Text style={{ color: "#878787" }}>Self Pickup</Text>
            </View>
            <View
              style={{
                width: 70,
                height: 90,
                backgroundColor: "#0066B1",
                borderRadius: 50,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "black",
              }}
            >
              <Text style={{ color: "white" }}>{day}</Text>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 28 }}
              >
                {dt}
              </Text>
              <Text style={{ color: "white" }}>{month}</Text>
            </View>
          </View>

          <View style={{ padding: 10 }}>
            <Text
              style={{ color: "#0066B1", fontWeight: "bold", fontSize: 20 }}
            >
              Add Voucher
            </Text>
            <Text style={{ color: "#878787", fontSize: 13, marginBottom: 10 }}>
              Please enter your vouchers one at a time, without using hyphens or
              spaces. You can only use one voucher per order.
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.inputViewMulti}>
                <TextInput
                  style={styles.inputTextMulti}
                  placeholder="Your Voucher Code"
                  placeholderTextColor="#878787"
                  value={voucherCode}
                  onChangeText={(text) => setVoucherCode(text)}
                />
              </View>
              <TouchableOpacity
                style={{
                  width: "25%",
                  backgroundColor: "#0066B1",
                  borderRadius: 50,
                  height: 50,
                  marginBottom: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 10,
                  marginTop: 5,
                }}
                onPress={() => applyVoucher()}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Apply
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.summaryContainer}>
            <Text
              style={{ color: "#0066B1", fontWeight: "bold", fontSize: 14 }}
            >
              Basket Summary
            </Text>
            <Text style={{ color: "black" }}>
              {/* Total Items = {bag.products.length} */}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#dedede",
                padding: 10,
                height: 50,
                width: "100%",
              }}
            >
              <Text style={{ color: "black" }}>Total</Text>
              <Text style={{ color: "black" }}>£ {bag.total_price}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#dedede",
                padding: 10,
                height: 50,
                width: "100%",
              }}
            >
              <Text style={{ color: "black" }}>Sale Tax</Text>
              <Text style={{ color: "black" }}>
                £ {bag.sales_tax.toFixed(2)}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#dedede",
                padding: 10,
                height: 50,
                width: "100%",
              }}
            >
              <Text style={{ color: "black" }}>Gov Bag Charges</Text>
              <Text style={{ color: "black" }}>£ {bag.govt_bag_charge}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#dedede",
                padding: 10,
                height: 50,
                width: "100%",
              }}
            >
              <Text style={{ color: "black" }}>Total Price</Text>
              <Text style={{ color: "black" }}>
                £ {(bag.total_price_inclusive_tax).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => {
                navigation.navigate("PayOrder", {
                  bag: bag,
                  type: type,
                  addressId: addressId,
                  voucherCode: voucherCode,
                  promodiscount: promodiscount,
                });
              }}
            >
              <View style={styles.checkoutBtnContainer}>
                <Text style={styles.checkoutBtnText}>Continue To Pay</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            width: "100%",
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              width: "60%",
            }}
          >
            <Text
              style={{ color: "#0066B1", fontWeight: "bold", fontSize: 20 }}
            >
              Delivery Details
            </Text>
            <Text style={{ color: "#878787" }}>Delivery Time: {time}</Text>
            <Text style={{ color: "#878787" }}>Delivery Address:{address}</Text>
          </View>
          <View
            style={{
              width: 70,
              height: 90,
              backgroundColor: "#0066B1",
              borderRadius: 10,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              // borderWidth: 2,
              borderColor: "black",
            }}
          >
            <Text style={{ color: "white" }}>{day}</Text>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 28 }}>
              {dt}
            </Text>
            <Text style={{ color: "white" }}>{month}</Text>
          </View>
        </View>
        <View style={{ padding: 10 }}>
          <Text style={{ color: "#0066B1", fontWeight: "bold", fontSize: 20 }}>
            Delivery Instructions
          </Text>
          <Text
            style={{
              color: "#878787",
              fontSize: 16,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            {deliveryInstruction}
          </Text>
        </View>

        <View style={{ padding: 10 }}>
          <Text style={{ color: "#0066B1", fontWeight: "bold", fontSize: 20 }}>
            Add Voucher
          </Text>
          <Text
            style={{
              color: "#878787",
              fontSize: 13,
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            Please enter your vouchers one at a time, without using hyphens or
            spaces. You can only use one voucher per order.
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.inputViewMulti}>
              <TextInput
                style={styles.inputTextMulti}
                placeholder="Your Voucher Code"
                placeholderTextColor="#878787"
                value={voucherCode}
                onChangeText={(text) => setVoucherCode(text)}
              />
            </View>
            <TouchableOpacity
              style={{
                width: "25%",
                backgroundColor: "#0066B1",
                borderRadius: 50,
                height: 50,
                marginBottom: 20,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                marginTop: 5,
              }}
              onPress={() => applyVoucher()}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Apply
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {promoError.status ? (
            <Text style={{ color: "red", fontSize: 12 }}>
              {promoError.message}
            </Text>
          ) : null}
        </View>

        <View style={styles.summaryContainer}>
          <Text style={{ color: "#0066B1", fontWeight: "bold", fontSize: 14 }}>
            Basket Summary
          </Text>
          <Text style={{ color: "black" }}>
            Total Items: {bag.products.length}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#dedede",
              width: "100%",
              height: 50,
              width: "100%",
            }}
          >
            <Text style={{ color: "black" }}>Total</Text>
            <Text style={{ color: "black" }}>
              £ {bag.total_price.toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#dedede",
              width: "100%",

              height: 50,
              width: "100%",
            }}
          >
            <Text style={{ color: "black" }}>Sale Tax</Text>
            <Text style={{ color: "black" }}>£ {bag.sales_tax.toFixed(2)}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#dedede",
              width: "100%",

              height: 50,
              width: "100%",
            }}
          >
            <Text style={{ color: "black" }}>Gov Bag Charges</Text>
            <Text style={{ color: "black" }}>
              £ {bag.govt_bag_charge.toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#dedede",

              height: 50,
              width: "100%",
            }}
          >
            <Text style={{ color: "black" }}>Delivery</Text>
            <Text style={{ color: "black", textAlign: "right" }}>
              £ {bag.delivery_charges.toFixed(2)}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#dedede",

              height: 50,
              width: "100%",
            }}
          >
            <Text style={{ color: "black" }}>Total Price</Text>
            <Text style={{ color: "black", textAlign: "right" }}>
              £ {bag.total_price_inclusive_tax.toFixed(2)}
            </Text>
          </View>

          {promodiscount.amount !== 0 ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#dedede",

                height: 50,
                width: "100%",
              }}
            >
              <Text style={{ color: "black" }}>Promo Discount</Text>
              <Text style={{ color: "black" }}>£ {promodiscount.amount}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.bottomView}>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => {
              navigation.navigate("PayOrder", {
                bag: bag,
                address: address,
                deliveryInstruction: deliveryInstruction,
                date: date,
                time: time,
                type: type,
                voucherCode: voucherCode,
                promodiscount: promodiscount,
                addressId: addressId,
              });
            }}
          >
            <View style={styles.checkoutBtnContainer}>
              <Text style={styles.checkoutBtnText}>Continue To Pay</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
  },
  bottomView: {
    width: '100%',
    // backgroundColor: 'green',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkoutBtn: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0066B1',
    padding: 15,
    marginTop: 10,
    borderRadius: 50,
  },
  checkoutBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputViewMulti: {
    width: '70%',
    borderColor: '#0066B1',
    borderWidth: 2,
    // backgroundColor: "#EEF1F0",
    borderRadius: 50,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 10,
    marginTop: 5,
    paddingLeft: 18,
    paddingRight: 18,
  },
  inputTextMulti: {
    height: 50,
    color: '#0066B1',
  },
  summaryContainer: {
    width: '95%',
    padding: 10,
  },
});

export default Checkoutsummary;
