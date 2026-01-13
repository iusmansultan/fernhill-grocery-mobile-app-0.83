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
        color: '#0066B1',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#0066b1',
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
        borderColor: '#0066B1',
        resizeMode: 'contain',
        backgroundColor: '#0066B1',
        overflow: 'hidden',
    },
    profileImage:{width: '100%', height: '100%' },
    name: {
        marginTop: 10,
        fontSize: 18,
        color: '#0066B1',
        fontWeight: "bold",
    }
})

export default styles