import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    root: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logo: {
        width: 200,
        height: 200,
        margin: 20,
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        color: 'black',
    },
    description: {
        textAlign: 'center',
        fontSize: 16,
        width: '60%',
        color: 'gray',
    },
    codeFieldRoot: {
        marginTop: 20,
        width: '100%',
    },
    cell: {
        width: 50,
        height: 50,
        lineHeight: 48,
        fontSize: 30,
        backgroundColor: '#EEF1F0',
        textAlign: 'center',
    },
    focusCell: {
        elevation: 10,
        color: '#0066B1',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#0066B1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
})

export default styles
