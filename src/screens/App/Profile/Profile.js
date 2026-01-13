import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useAppSelector } from "../../../redux/Hooks";
import { useAppDispatch } from "../../../redux/Hooks";
import { saveUser, saveImage } from "../../../redux/auth/AuthSlice";
import { UpdateUserInfo } from "../../../helpers/Backend";
import { ActivityIndicator } from "react-native-paper";
import * as ImagePicker from "react-native-image-picker";
// import { Storage } from "aws-amplify";

const Profile = ({ navigation }) => {
  const user = useAppSelector((state) => state.user.value);
  const token = useAppSelector((state) => state.user.token);
  const dispatch = useAppDispatch(); //dispatch
  const [profile, setProfile] = useState(
    "https://180dc.org/wp-content/uploads/2016/08/default-profile.png"
  );
  const [name, setName] = useState(user.userData.username);
  const [email, setEmail] = useState(user.userData.email);
  const [phone, setPhone] = useState(user.userData.phone);

  const [loading, setLoading] = useState(false);

  const SaveDetails = () => {
    const val = ValidateFields();
    if (val) {
      setLoading(true);
      const body = {
        username: name,
        phone: phone,
      };
      UpdateUserInfo(token, body)
        .then((res) => {
          const data = {
            isLoggedIn: true,
            userData: res,
          };
          dispatch(saveUser(data));
          setLoading(false);
          navigation.pop();
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      Alert.alert("Error", "Please fill all the fields");
    }
  };

  const ValidateFields = () => {
    if (name === "") {
      Alert.alert("Error", "Please enter your name");
      return false;
    }
    if (phone === "") {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }
    return true;
  };

  const UploadImage = (url) => {
    // Storage.put(`profileImages/${user.userData.user_id}/profile.jpg`, url, {
    //   contentType: "image/jpeg", // contentType is optional
    // })
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const SelectImage = () => {
    ImagePicker.launchImageLibrary({}, (response) => {
      console.log(response.assets[0].uri);
      if (response.assets[0].uri) {
        // setProfile(response.assets[0].uri);
        UploadImage(response.assets[0].uri);
      }
    });
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <View style={styles.profile}>
          <Image
            source={{
              uri:
                user.userData.image === ""
                  ? "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
                  : profile,
            }}
            style={styles.image}
          />
          <View style={styles.imageEdit}>
            <TouchableOpacity onPress={SelectImage}>
              <Text style={styles.text}>Upload Photo</Text>
            </TouchableOpacity>
            <Text style={styles.text}> | </Text>
            <Text style={styles.text}>Remove Photo</Text>
          </View>
        </View>
        <View style={styles.info}>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Full Name</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                // placeholder={name}
                value={name}
                onChangeText={(text) => setName(text)}
              />
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Email Address</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                // placeholder={email}
                value={email}
                onChangeText={(text) => setEmail(text)}
              />
            </View>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Phone Number</Text>
            <View style={styles.inputView}>
              <TextInput
                style={styles.inputText}
                // placeholder={phone}
                value={phone}
                onChangeText={(text) => setPhone(text)}
              />
            </View>
          </View>
          <TouchableOpacity onPress={SaveDetails} style={styles.saveBtn}>
            {loading ? (
              <ActivityIndicator animating={true} color="white" />
            ) : (
              <View>
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Save Details
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
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
    borderColor: "#0061B1",
  },
  imageEdit: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
  },
  text: {
    fontWeight: "bold",
    color: "#0061B1",
  },
  inputText: {
    height: 50,
    color: "#0061B1",
    marginLeft: 10,
  },
  inputView: {
    width: "100%",
    borderColor: "#0066B1",
    borderWidth: 2,
    // backgroundColor: "#EEF1F0",
    borderRadius: 50,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 10,
    marginTop: 5,
  },
  infoContainer: {
    width: "80%",
  },
  saveBtn: {
    width: "80%",
    alignItems: "center",
    backgroundColor: "#0066B1",
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
  },
  info: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
});

export default Profile;
