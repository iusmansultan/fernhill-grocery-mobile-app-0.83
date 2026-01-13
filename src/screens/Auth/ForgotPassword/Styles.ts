import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    subtitle: {
        fontSize: 18,
        color: '#a8a8a8',
        marginTop: 10,
        marginBottom: 10,
    },
    label: {
        fontSize: 18,
        color: 'black',
        marginTop: 20,
    },
    inputView: {
        width: "100%",
        marginTop: 10,
        borderWidth: 0.5,
        borderColor: '#a8a8a8',
        backgroundColor: 'white',
        borderRadius: 50,
        height: 50,
        marginBottom: 4,
        justifyContent: "center",
        padding: 10,
        paddingHorizontal: 20,
    },
    inputText: {
        height: 50,
        color: "#0066B1",
    },
    helperText: {
        color: '#a8a8a8',
    },
    submitButton: {
        backgroundColor: '#0066B1',
        width: '100%',
        height: 50,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default styles
