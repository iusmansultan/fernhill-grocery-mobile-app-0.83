import { Platform, StyleSheet } from "react-native"

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    container: {
        flex: 1.5,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 100,
    },
    topBar: {
        width: '100%',
        backgroundColor: '#0066B1',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    searchbar: {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    },
    mainContainer: {
        marginBottom: 100,
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    listContainer: {
        width: '100%',
        height: Platform.OS === 'ios' ? '93%' : '96%',
        alignItems: 'center',
    },
})

export default styles