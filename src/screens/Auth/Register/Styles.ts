import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        marginTop: "5%",
        height: "20%",
        width: "70%",
        marginBottom: 30,
        resizeMode: "contain",
    },
    socialLogin: {
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    signup: {
        marginTop: "10%",
        width: "45%",
        flexDirection: "row",
        justifyContent: "center",
    },
    inputText: {
        height: 50,
        color: "#0066B1",
    },
    inputView: {
        width: "90%",
        backgroundColor: "#EEF1F0",
        borderRadius: 50,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 10,
        paddingHorizontal: 20,
    },
    passwordInputView: {
        width: "90%",
        backgroundColor: "#EEF1F0",
        borderRadius: 50,
        height: 50,
        justifyContent: "center",
        padding: 10,
        paddingHorizontal: 20,
    },
    forgotPasswordView: {
        width: "80%",
        borderRadius: 5,
        marginBottom: 2,
        justifyContent: "center",
        padding: 10,
    },
    loginBtn: {
        width: "90%",
        backgroundColor: "#0066B1",
        borderRadius: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10,
    },
    signupBtn: {
        width: "30%",
        backgroundColor: "#0066B1",
        borderRadius: 45,
        alignItems: "center",
        justifyContent: "center",
        padding: "2%",
    },
    socialLoginBtn: {
        width: "48%",
        backgroundColor: "#0066B1",
        borderRadius: 5,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 6,
        marginBottom: 10,
    },
    loginText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    signINButtonText: {
        marginLeft: 5,
        color: "#0066B1",
        fontWeight: "bold",
        fontSize: 16,
    },
    textBlack: { color: "black" },
    infoText: {
        color: "#a8a8a8",
        padding: 10,
        marginLeft: 20,
    }
});

export default styles