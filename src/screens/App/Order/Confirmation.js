import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const Confirmation = ({ navigation }) => {

    useEffect(() => {
        setTimeout(() => {
            navigation.replace('Main');
        }, 6000);
    })

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../../assets/ordersuccess.json')}
                autoPlay loop={false}
                style={styles.lottie}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    lottie: { width: '100%', height: '100%' }
})


export default Confirmation;