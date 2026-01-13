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
import useLogin from "./useLogin";

const Login = () => {
    const {
        setEmail,
        setPassword,
        loading,
        SignIn,
        ForgotUserPassword,
        navigateToSignUp,
    } = useLogin();

    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logo} />

            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    placeholder={"Email Address"}
                    placeholderTextColor={"#0066B1"}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    
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
            <View style={styles.forgotPasswordView}>
                <TouchableOpacity onPress={ForgotUserPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.loginBtn} onPress={SignIn}>
                {loading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <Text style={styles.loginText}>LOGIN</Text>
                )}
            </TouchableOpacity>

            <View style={styles.signup}>
                <Text style={styles.textBlack}>Don't have account?</Text>
                <TouchableOpacity onPress={navigateToSignUp}>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;
