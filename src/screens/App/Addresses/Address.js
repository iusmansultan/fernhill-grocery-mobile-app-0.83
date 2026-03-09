import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAppSelector } from "../../../redux/Hooks"; //this import is for redux
import { FetchUserAddresses, RemoveAddress } from "../../../helpers/Backend";
import Loader from "../../../components/ProductLoader";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./Styles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Address = ({ navigation }) => {
  const user = useAppSelector((state) => state.user.value);
  const token = useAppSelector((state) => state.user.token);
  const [address, setAddress] = useState([])
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getUserAddresses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getUserAddresses = async () => {
    try {
      console.log(user.userData, "user");
      setLoading(true)
      const response = await FetchUserAddresses(user.userData.id)
      console.log(response.data.data, "address");
      setAddress(response.data.data)
      console.log(response)
      setLoading(false)
    } catch (e) {
      console.log(e)
      setLoading(false)
    }
  }


  useFocusEffect(
    useCallback(() => {
      getUserAddresses();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const RemoveUserAddress = async (id) => {
    console.log(id, "IDD =>");
    try {
      setLoading(true)
      await RemoveAddress(token, id);
      await getUserAddresses();
    } catch (err) {
      console.error(err);
      setLoading(false)
    }

  };

  if (loading) {
    return (
      <Loader />
    );
  }

  return (
    <View style={styles.container}>

      {address === null ? (
        <Text style={styles.text}>No address added yet</Text>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.addresses}>
            {address &&
              address.map((item, index) => {
                if (item.default_address) {
                  return (
                    <View style={styles.addressContainer} key={index}>
                      <Text
                        style={styles.defaultAddressText}
                      >
                        Default Address
                      </Text>
                      <Text style={styles.text}>
                        {item.first_name} {item.last_name}
                      </Text>
                      <Text style={styles.text}>
                        {item.street1} {item.street2} {item.town}
                      </Text>
                       <View style={styles.addressBtn}>
                      <TouchableOpacity style={styles.removeAddressBtn}
                        onPress={() => RemoveUserAddress(item.id)}
                      >
                        <Icon name="trash-can" size={20} color="#ff2d26" />
                        <Text style={styles.btnText}>Remove</Text>
                      </TouchableOpacity>
                   
                    </View>
                    </View>
                  );
                }
              })}
            {address.map((item, index) => {
              if (!item.default_address) {
                return (
                  <View style={styles.addressContainer} key={index}>
                    <Text
                      style={styles.defaultAddressText}
                    >
                      Previous Address
                    </Text>
                    <Text style={styles.text}>
                      {item.first_name} {item.last_name}
                    </Text>
                    <Text style={styles.text}>
                      {item.street1} {item.street2} {item.town}
                    </Text>
                    <View style={styles.addressBtn}>
                      <TouchableOpacity style={styles.removeAddressBtn}
                        onPress={() => RemoveUserAddress(item.id)}
                      >
                        <Icon name="trash-can" size={20} color="#ff2d26" />
                        <Text style={styles.btnText}>Remove</Text>
                      </TouchableOpacity>
                   
                    </View>
                  </View>
                );
              }
            })}
          </View>
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.addAddressBtn}
        onPress={() => {
          navigation.navigate("AddNewAddress");
        }}
      >
        <Text style={styles.addressText}>Add New Address</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Address;
