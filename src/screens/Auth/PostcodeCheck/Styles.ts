import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    logo: {
        height: 120,
        width: "80%",
        marginBottom: 40,
        resizeMode: "contain",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#1946A9",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        // marginBottom: 30,
        paddingHorizontal: 20,
    },
    inputView: {
        width: "80%",
        backgroundColor: "#EEF1F0",
        borderRadius: 25,
        height: 50,
        marginTop: 30,
        // marginBottom: 20,
        justifyContent: "center",
        padding: 10,
    },
    inputText: {
        height: 50,
        color: "#1946A9",
        marginLeft: 10,
        fontSize: 18,
        textAlign: "center",
        fontWeight: "600",
    },
    checkBtn: {
        width: "80%",
        backgroundColor: "#1946A9",
        borderRadius: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    checkBtnText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    successContainer: {
        alignItems: "center",
        // marginTop: 20,
    },
    successIcon: {
        fontSize: 60,
        marginBottom: 15,
    },
    successText: {
        fontSize: 18,
        color: "#1946A9",
        fontWeight: "600",
        marginBottom: 10,
        textAlign: "center",
    },
    continueBtn: {
        width: "80%",
        backgroundColor: "#1946A9",
        borderRadius: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        paddingHorizontal: 20,
    },
    continueBtnText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    errorText: {
        color: "#EF4444",
        fontSize: 14,
        textAlign: "center",
        marginTop: 10,
        paddingHorizontal: 20,
    },
});

export default styles;
