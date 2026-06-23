import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
    },
    loaderContainer: {
        backgroundColor: '#1946A9',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
    },
    loaderImage:{
        width: 60,
        height: 60,
        tintColor: 'white',
    }
});

export default styles;