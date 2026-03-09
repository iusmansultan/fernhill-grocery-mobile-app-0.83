import React from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import styles from "./Styles";
import useAddNewAddress from "./useAddNewAddress";
const { googlePlacesApiKey } = require("../../../../helpers/Config");

const AddNewAddress = () => {
  const {
    loading,
    isEnabled,
    fname,
    lname,
    phone,
    setFName,
    setLName,
    setPhone,
    toggleSwitch,
    SaveAddress,
    onPlaceSelected,
  } = useAddNewAddress();

  return (
    <View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            {/* <View style={styles.infoContainer}>
              <Text style={styles.text}>Street Address 1</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="123 Main St"
                  value={address1}
                  onChangeText={(text) => setAddress1(text)}
                />
              </View>
            </View> */}
            {/* <View style={styles.infoContainer}>
              <Text style={styles.text}>Street Address 2</Text>
              <View style={styles.inputView}>
                <TextInput
                  style={styles.inputText}
                  placeholder="Apt. 2"
                  value={address2}
                  onChangeText={(text) => setAddress2(text)}
                />
              </View>
            </View> */}
            {/* <View style={styles.infoContainer}>
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
            </View> */}
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
            <View style={styles.placesContainer}>
              <Text style={styles.text}>Search Address</Text>
              <GooglePlacesAutocomplete
                placeholder="Start typing your address"
                fetchDetails
                onPress={(_, details) => onPlaceSelected(details as any)}
                onFail={(err) => console.error (err)}
                query={{
                  key: googlePlacesApiKey,
                  language: "en",
                  components: "country:gb",
                }}
                enablePoweredByContainer={false}
                disableScroll={true}
                listViewDisplayed="auto"
                keepResultsAfterBlur={true}
                styles={{
                  textInputContainer: styles.placesTextInputContainer,
                  textInput: styles.placesTextInput,
                  listView: styles.placesListView,
                  row: styles.placesRow,
                  description: styles.placesDescription,
                }}
              />
            </View>
            <View style={styles.setDefult}>
              <Switch
                trackColor={{ false: "white", true: "#0066B1" }}
                thumbColor={isEnabled ? "#ffffff" : "#0066B1"}
                ios_backgroundColor="white"
                onValueChange={toggleSwitch}
                value={isEnabled}
                style={styles.switch}
              />
              <Text style={styles.text}>Set address as default</Text>
            </View>
            <TouchableOpacity onPress={SaveAddress} style={styles.saveBtn}>
              {loading ? (
                <ActivityIndicator animating={true} color="white" />
              ) : (
                <View>
                  <Text style={styles.saveBtnText}>Save Address</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default AddNewAddress;
