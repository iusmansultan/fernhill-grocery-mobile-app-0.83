import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
} from "react-native";
import logo from "../../../../src/assets/logo.png";
import { ActivityIndicator } from "react-native-paper";
import styles from "./Styles";
import useSignUp from "./useSignUp";
const SignUp = () => {
    const { handleSignUp, setEmail, setPassword, loading, navigation } = useSignUp();

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder={"Email Address"}
                    placeholderTextColor={"#0066B1"}
                    onChangeText={(text) => setEmail(text)}
                />
            </View>
            <View style={styles.passwordInputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder={"Password"}
                    placeholderTextColor={"#0066B1"}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                    maxLength={14}
                />
            </View>
            <Text
                style={styles.infoText}
            >
                Password must be at least 8 characters with special characters
            </Text>

            <TouchableOpacity style={styles.loginBtn} onPress={handleSignUp}>
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.loginText}>Sign Up</Text>
                )}
            </TouchableOpacity>

            <View style={styles.signup}>
                <Text style={styles.textBlack}>Already have account?</Text>
                <TouchableOpacity
                    onPress={() => {
                        (navigation as any).navigate("Login");
                    }}
                >
                    <Text
                        style={styles.signINButtonText}
                    >
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default SignUp