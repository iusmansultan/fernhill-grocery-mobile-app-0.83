import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        width: '48.5%',
        height: 165,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        margin: 2,
    },
    label: {
        fontSize: 19,
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 10,
        marginTop: 10,
        textAlign: 'center'
    },
    image: { width: 80, height: 80, resizeMode: 'contain' }
})

export default styles