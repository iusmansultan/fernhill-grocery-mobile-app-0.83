import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAppSelector, useAppDispatch } from "../../../redux/Hooks"; //this import is for redux
import { saveUser } from "../../../redux/auth/AuthSlice";
import { FetchUserAddresses, RemoveAddress } from "../../../helpers/Backend";

const Address = ({ navigation }) => {
  const user = useAppSelector((state) => state.user.value);
  const token = useAppSelector((state) => state.user.token);
  const [address, setAddress] = useState([])

  useEffect(() => {
    getUserAddresses()
  }, [])

  const getUserAddresses = async () => {
    try {
      const response = await FetchUserAddresses(user.userData.id)
      setAddress(response.data.data)
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  console.log(address, "address");
  const dispatch = useAppDispatch();
  const RemoveUserAddress = (id) => {
    console.log(id);
    RemoveAddress(token, id)
      .then((response) => {
        // console.log(response);
        const data = {
          isLoggedIn: true,
          userData: response,
        };
        dispatch(saveUser(data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={{
            uri:
              user.userData.image !== ""
                ? user.userData.image
                : "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png",
          }}
          style={styles.image}
        />
        <Text style={styles.name}>{user.userData.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.addAddressBtn}
        onPress={() => {
          navigation.navigate("AddNewAddress");
        }}
      >
        <Text style={styles.addressText}>Add New Address</Text>
      </TouchableOpacity>
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
                        style={{
                          marginBottom: 5,
                          fontWeight: "bold",
                          color: "black",
                        }}
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
                        <TouchableOpacity
                          onPress={() => RemoveUserAddress(item.address_id)}
                        >
                          <Text style={styles.btnText}>Remove</Text>
                        </TouchableOpacity>
                        <Text style={styles.btnText}>|</Text>
                        <Text style={styles.btnText}>Edit</Text>
                        <Text style={styles.btnText}>|</Text>
                        <Text style={styles.btnText}>Set as Default</Text>
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
                      style={{
                        marginBottom: 5,
                        fontWeight: "bold",
                        color: "black",
                        fontSize: 16,
                      }}
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
                      <TouchableOpacity
                        onPress={() => RemoveUserAddress(item.address_id)}
                      >
                        <Text style={styles.btnText}>Remove</Text>
                      </TouchableOpacity>
                      <Text style={styles.btnText}>|</Text>
                      <Text style={styles.btnText}>Edit</Text>
                      <Text style={styles.btnText}>|</Text>
                      <Text style={styles.btnText}>Set as Default</Text>
                    </View>
                  </View>
                );
              }
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
  },
  addresses: {
    width: "100%",
    alignItems: "center",
  },
  addressContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: "#0066B1",
    borderRadius: 20,
    marginTop: 8,
    padding: 20,
    marginBottom: 10,
  },
  addAddressBtn: {
    width: "85%",
    backgroundColor: "#0066B1",
    borderRadius: 50,
    padding: 17,
    // paddingLeft: 30,
    // paddingRight: 30,
    marginBottom: 15,
    alignItems: "center",
  },
  addressBtn: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  addressText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  btnText: {
    fontSize: 16,
    color: "#0066B1",
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#0066B1",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066B1",
  },
  profile: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default Address;
