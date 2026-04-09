import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../../redux/Hooks";
import { saveStoreId, saveZip } from "../../../redux/auth/AuthSlice";
import { GetStoreId } from "../../../helpers/Backend";
import logo from "../../../assets/logo.png";
import styles from "./Styles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const PostcodeCheck = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const [postcode, setPostcode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const checkPostcode = () => {
        if (postcode.trim() === "") {
            Alert.alert("Error", "Please enter your postcode");
            return;
        }

        setLoading(true);
        setError("");

        GetStoreId(postcode, "")
            .then((res: any) => {
                console.log("Postcode check =>", res.data);
                if (res.data.status) {
                    setIsValid(true);
                    dispatch(saveStoreId(res.data.data));
                    dispatch(saveZip(postcode));
                } else {
                    setError("Sorry, we are not available in your area yet. We have noted your interest and will be there soon!");
                }
                setLoading(false);
            })
            .catch((err: any) => {
                console.log(err);
                setError("Something went wrong. Please try again.");
                setLoading(false);
            });
    };

    const continueToLogin = () => {
        (navigation as any).navigate("Login");
    };

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />

            <Text style={styles.title}>Welcome to Fernhill</Text>
           {
            isValid ? null : (
                <Text style={styles.subtitle}>
                    Enter your postcode to check if we deliver to your area
                </Text>
            )
           }

            {!isValid ? (
                <>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Enter Postcode"
                            placeholderTextColor="#1946A9"
                            onChangeText={(text) => setPostcode(text.toUpperCase())}
                            value={postcode}
                            maxLength={8}
                            autoCapitalize="characters"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.checkBtn}
                        onPress={checkPostcode}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.checkBtnText}>Check Availability</Text>
                        )}
                    </TouchableOpacity>

                    {error !== "" && (
                        <Text style={styles.errorText}>{error}</Text>
                    )}
                </>
            ) : (
                <View style={styles.successContainer}>
                    <Icon name="check-circle" size={60} color="#1946A9" style={styles.successIcon} />
                    <Text style={styles.successText}>
                        Great news! We deliver to your area.
                    </Text>

                    <TouchableOpacity
                        style={styles.continueBtn}
                        onPress={continueToLogin}
                    >
                        <Text style={styles.continueBtnText}>Continue to Shopping</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default PostcodeCheck;
