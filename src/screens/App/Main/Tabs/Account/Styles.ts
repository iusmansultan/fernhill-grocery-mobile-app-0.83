import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    accountOptions: {
        margin: 20,
        width: '50%',
        backgroundColor: 'white',
    },
    options: {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        color: '#1946A9',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#1946A9',
        textAlign: 'left',
    },
    profile: {
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#1946A9',
        resizeMode: 'contain',
        backgroundColor: '#1946A9',
        overflow: 'hidden',
    },
    profileImage:{width: '100%', height: '100%' },
    name: {
        marginTop: 10,
        fontSize: 18,
        color: '#1946A9',
        fontWeight: "bold",
    }
})

export default styles