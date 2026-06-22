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
        // borderWidth: 4,
        // borderColor: '#1946A9',
        resizeMode: 'contain',
        backgroundColor: '#1946A9',
        overflow: 'hidden',
    },
    profileImage:{width: '100%', height: '100%', resizeMode: 'cover' },
    name: {
        marginTop: 10,
        fontSize: 18,
        color: '#1946A9',
        fontWeight: "bold",
    },
    deleteAccountBtn: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'red',
        width: '90%',
        alignItems: 'center',
    },
    deleteAccountView: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 10 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }
})

export default styles