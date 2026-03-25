import { StyleSheet } from "react-native";

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
        borderColor: "#1946A9",
        borderRadius: 20,
        marginTop: 8,
        padding: 20,
        marginBottom: 10,
    },
    addAddressBtn: {
        width: "85%",
        backgroundColor: "#1946A9",
        borderRadius: 50,
        padding: 17,
        // paddingLeft: 30,
        // paddingRight: 30,
        marginBottom: 35,
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
        color: "#ff2d26",
        fontWeight: "bold",
        textAlign: "center",
    },
    text: {
        fontSize: 16,
        maxWidth: "90%"
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: "#1946A9",
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1946A9",
    },
    profile: {
        width: "100%",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 10,
    },
    defaultAddressText: {
        marginBottom: 5,
        fontWeight: "bold",
        color: "black",
    },
    removeAddressBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    }
});

export default styles;
