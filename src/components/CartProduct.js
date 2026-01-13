import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';

const Cartproduct = ({ id, image, decription, price, qty }) => {
    const defaultImage = "http://mckinleytrade.com/public/images/no-thumbnail.jpg"

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {
                    (image !== "")
                        ? <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
                        : <Image source={{ uri: defaultImage }} style={{ width: '100%', height: '100%' }} />

                }
            </View>
            <View style={styles.description}>
                <Text numberOfLines={2}>{decription}</Text>
                <View style={styles.qtyBtn}>
                    <Text style={{ color: 'black' }}>Qty:</Text>
                    <Text style={{ color: 'black' }}>-</Text>
                    <Text style={{ color: 'black' }}>{qty}</Text>
                    <Text style={{ color: 'black' }}>+</Text>
                </View>
            </View>
            <Text style={styles.price}>€{(price * qty)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '15%',
        // backgroundColor: 'green',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 50,
        borderBottomWidth: 1,
        borderColor: '#d9d9d9',
    },
    imageContainer: {
        width: '20%',
        height: '100%',
    },
    description: {
        width: '55%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'black',

    },
    price: {
        position: 'relative',
        top: '14%',
        color: 'black',

    },
    qtyBtn: {
        width: '45%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
})

export default Cartproduct;
