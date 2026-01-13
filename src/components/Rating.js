import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import star from '../assets/star.png';

const Rating = ({ rating }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.ratingText}>Rating:</Text>
            {
                (rating === 1)
                    ? <View style={styles.rating}>
                        <Image source={star} style={styles.star} />
                    </View>
                    : (rating === 2)
                        ? <View style={styles.rating}>
                            <Image source={star} style={styles.star} />
                            <Image source={star} style={styles.star} />
                        </View>
                        : (rating === 3)
                            ? <View style={styles.rating}>
                                <Image source={star} style={styles.star} />
                                <Image source={star} style={styles.star} />
                                <Image source={star} style={styles.star} />
                            </View>
                            : (rating === 4)
                                ? <View style={styles.rating}>
                                    <Image source={star} style={styles.star} />
                                    <Image source={star} style={styles.star} />
                                    <Image source={star} style={styles.star} />
                                    <Image source={star} style={styles.star} />
                                </View>
                                : (rating === 5)
                                    ? <View style={styles.rating}>
                                        <Image source={star} style={styles.star} />
                                        <Image source={star} style={styles.star} />
                                        <Image source={star} style={styles.star} />
                                        <Image source={star} style={styles.star} />
                                        <Image source={star} style={styles.star} />
                                    </View>
                                    : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,

    },
    ratingText: {
        fontSize: 16,
        color: 'black',

    },
    rating: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    star: {
        width: 20,
        height: 20,
        margin: 1,
    }
})

export default Rating;
