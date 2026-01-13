import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBar: {
        width: '100%',
        backgroundColor: '#0066B1',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    statusBarContainer: {
        height: 40,
        backgroundColor: '#0066B1',
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    logoSmall: {
        width: 100,
        height: 30,
        resizeMode: 'contain',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    emptyMessage: {
        marginTop: '10%',
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    scrollView: {
        width: '100%',
        height: '88%',
        marginBottom: '10%',
    },
    productView: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: 5,
        marginBottom: 40,
        padding: 10,
    },
    iosStatusBar: {
        height: 40,
        backgroundColor: '#0066B1',
    },
    searchbar: {
        backgroundColor: 'white',
        elevation: 0,
    },
    activityIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default styles
