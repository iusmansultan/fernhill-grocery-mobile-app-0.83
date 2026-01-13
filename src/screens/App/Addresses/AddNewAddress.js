import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useAppSelector } from "../../../redux/Hooks";
import { useAppDispatch } from "../../../redux/Hooks";
import { saveUser } from "../../../redux/auth/AuthSlice";
import { AddUserAddress } from "../../../helpers/Backend";

const AddNewAddress = ({ navigation }) => {
  const user = useAppSelector((state) => state.user.value);
  const token = useAppSelector((state) => state.user.token);
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(!isEnabled);

  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [town, setTown] = useState("");
  const [passcode, setPasscode] = useState("");
  const [phone, setPhone] = useState("");
  // const [DeliveryInstruction, setDeliveryInstruction] = useState("");

  const SaveAddress = () => {
    const val = ValidateFields();

    if (val) {
      const addressBody = {
        userId: user.userData.id,
        firstName: fname,
        lastName: lname,
        street1: address1,
        street2: address2,
        town: town,
        postalCode: passcode,
        phone: phone,
        isDefaultAddress: isEnabled,
      };

      setLoading(true);
      AddUserAddress(token, addressBody)
          .then((res) => {
            
            console.log ("RESRESRES",res)
          const data = {
            isLoggedIn: true,
            userData: {
              ...user.userData,
              user_address: res.data,
            },
          };
          dispatch(saveUser(data));
          setLoading(false);
          navigation.pop();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Alert.alert("Please fill all the fields");
    }
  };

  const ValidateFields = () => {
    if (fname == "") {
      Alert.alert("Please enter first name");
      return false;
    }
    if (lname == "") {
      Alert.alert("Please enter last name");
      return false;
    }
    if (address1 == "") {
      Alert.alert("Please enter steet 1");
      return false;
    }
    if (address2 == "") {
      Alert.alert("Please enter steet 2");
      return false;
    }
    if (town == "") {
      Alert.alert("Please enter town");
      return false;
    }
    if (passcode == "") {
      Alert.alert("Please enter postal code");
      return false;
    }
    if (phone == "") {
      Alert.alert("Please enter phone number");
      return false;
    }
    return true;
  };

  return (
    <View>
      <ScrollView
        style={{
          height: "100%",
          backgroundColor: "white",
        }}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.container}
        >
          <View style={styles.info}>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>First Name</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="John"
                  value={fname}
                  onChangeText={(text) => setFName(text)}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Last Name</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Doe"
                  value={lname}
                  onChangeText={(text) => setLName(text)}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Street Address 1</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="123 Main St"
                  value={address1}
                  onChangeText={(text) => setAddress1(text)}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Street Address 2</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Apt. 2"
                  value={address2}
                  onChangeText={(text) => setAddress2(text)}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Town</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="London"
                  value={town}
                  onChangeText={(text) => setTown(text)}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Passcode</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Passcode e.g 1234 for the door "
                  value={passcode}
                  onChangeText={(text) => setPasscode(text)}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Phone Number</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="+44 123456789"
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                />
              </View>
            </View>

            <View style={styles.setDefult}>
              <Switch
                trackColor={{ false: "white", true: "#0066B1" }}
                thumbColor={isEnabled ? "#0066B1" : "#0066B1"}
                ios_backgroundColor="white"
                borderColor="black"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={{ marginRight: 10 }}
              />
              <Text style={styles.text}>Set address as default</Text>
            </View>
            <TouchableOpacity onPress={SaveAddress} style={styles.saveBtn}>
              {loading ? (
                <ActivityIndicator animating={true} color="white" />
              ) : (
                <View>
                  <Text
                    style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                  >
                    Save Address
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  profile: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#0066B1",
  },
  imageEdit: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  text: {
    fontWeight: "bold",
    color: "#0066B1",
  },
  inputText: {
    height: 50,
    color: "#0066B1",
  },
  inputTextMulti: {
    // height: 50,
    color: "#0066B1",
  },
  inputView: {
    width: "100%",
    borderColor: "#0066B1",
    borderWidth: 1.5,
    // backgroundColor: "#EEF1F0",
    borderRadius: 50,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 10,
    marginTop: 5,
    paddingLeft: 20,
    paddingRight: 20,
  },
  inputViewMulti: {
    width: "100%",
    borderColor: "#0066B1",
    borderWidth: 2,
    // backgroundColor: "#EEF1F0",
    borderRadius: 50,
    height: 140,
    marginBottom: 20,
    // justifyContent: "center",
    alignItems: "flex-start",
    padding: 10,
    marginTop: 5,
  },
  infoContainer: {
    width: "90%",
  },
  setDefult: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  saveBtn: {
    width: "90%",
    alignItems: "center",
    backgroundColor: "#0066B1",
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    marginBottom: 40,
  },
  info: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});

export default AddNewAddress;
