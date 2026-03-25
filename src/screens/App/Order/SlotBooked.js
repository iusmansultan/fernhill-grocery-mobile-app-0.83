/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { useAppSelector } from '../../../redux/Hooks';
import bike from '../../../assets/bike.png';
import Modal from "react-native-modal";
import { FetchUserAddresses } from '../../../helpers/Backend';
import { useFocusEffect } from '@react-navigation/native';

const Slotbooked = ({ navigation, route }) => {
    const { type, bag } = route.params;
    const user = useAppSelector((state) => state.user.value);

    const [address, setAdress] = useState('');
    const [addressId, setAddressId] = useState('');
    const date = new Date().toDateString();
    const [time, setTime] = useState('');
    const [deliveryInstruction, setDeliveryInstruction] = useState('')
    const [modalVisible, setModalVisible] = useState(false);
    const [modalState, setModalState] = useState(1);
    const currentTime = new Date().getHours()
    const [availableTime, setAvailableTime] = useState([])
    const [addresses, setAddresses] = useState([])

    useEffect(() => {
        getUserAddresses()
    }, [])

    const getUserAddresses = async () => {
        try {
            const response = await FetchUserAddresses(user.userData.id)
            if (response.data.data.length < 1) {
                setModalVisible(false);
                navigation.navigate("AddNewAddress");
            }
            setAddresses(response.data.data)
            console.log(response)
        } catch (e) {
            console.log(e)
        }
    }

    useFocusEffect(
        useCallback(() => {
            getUserAddresses();
        }, [])
    );

    const [isTimeModalVisible, setTimeModalVisible] = useState(false);

    const getAvailableTimeSlots = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const slots = [];

        for (let hour = 0; hour < 24; hour++) {
            for (let minute of [0, 15, 30, 45]) {
                if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
                    const formattedHour = hour.toString().padStart(2, '0');
                    const formattedMinute = minute.toString().padStart(2, '0');
                    slots.push(`${formattedHour}:${formattedMinute}`);
                }
            }
        }
        return slots;
    };

    const handleTimeSelect = (selectedTime) => {
        setTime(selectedTime);
        setTimeModalVisible(false);
    };

    useEffect(() => {
        if (user.userData.user_address === null) {
            navigation.navigate('Address');
        }
        setAvailableTime(getAvailableTimeSlots());
    }, [])

    const Done = () => {
        // if (time === '' || address === '') {
        //     Alert.alert('Error', 'Please enter your time slot and address')
        // } else {
        //     console.log("addressId", addressId);
        //     console.log("address", address);

        //     navigation.navigate('CheckOutSummary', {
        //         type: type,
        //         address: address,
        //         date: date,
        //         time: time,
        //         deliveryInstruction: deliveryInstruction,
        //         bag: bag,
        //         addressId: addressId
        //     })
        // }

        if (type === "Pickup") {
            if (time === '') {
                Alert.alert('Error', 'Please enter your time slot');
                return;
            }
        } else if (type === "homedelivery") {
            if (address === '') {
                Alert.alert('Error', 'Please select your address');
                return;
            }
        }

        navigation.navigate('CheckOutSummary', {
            type: type,
            address: address,
            date: date,
            time: time,
            deliveryInstruction: deliveryInstruction,
            bag: bag,
            addressId: addressId
        });
    }

    if (modalVisible) {
        return (
            <Modal isVisible={true}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>

                    <View style={{
                        backgroundColor: '#dedede',
                        borderRadius: 30,
                        padding: 10,
                        width: '90%',
                    }}>
                        <Text style={{ color: "black", padding: 10 }}>Select a preferred address</Text>
                        <View style={{
                            width: '100%',

                        }} >
                            {
                                addresses && addresses.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            style={{
                                                marginTop: 10,
                                                padding: 10,
                                                borderRadius: 50,
                                                borderColor: '#e3e3e3',
                                                borderWidth: 1,
                                                margin: 5,
                                                backgroundColor: 'white',
                                                width: '100%',
                                            }}
                                            key={index}
                                            onPress={() => {
                                                setAdress(item.street1 + ' ' + item.street2 + ' ' + item.town)
                                                setAddressId(item.id)
                                                setModalVisible(false)
                                            }}
                                        >
                                            <Text style={{ color: 'black' }}>{item.street1} {item.street2} {item.town}</Text>

                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </View>

                    </View>

                </View>

            </Modal >
        );
    }

    return (
        <View style={styles.container}>

            <ScrollView>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10,
                        width: '100%',
                    }}
                >
                    <View style={{
                        justifyContent: 'space-between',
                        width: '60%',
                    }}>
                        <Text style={{ color: '#1946A9', fontWeight: 'bold', fontSize: 20 }}>
                            {
                                type === "Pickup" ? "Self Pickup" : "Home Delivery"
                            }
                        </Text>
                        <Text style={{ color: '#1946A9', marginTop: 10, fontWeight: 'bold' }}>{date}</Text>
                        {
                            type === "Pickup" && (<TouchableOpacity
                                onPress={() => {
                                    setAvailableTime(getAvailableTimeSlots());
                                    setTimeModalVisible(true);
                                }}
                            >
                                {
                                    (time === '')
                                        ? <Text style={{ color: '#1946A9', marginTop: 10, fontWeight: 'bold' }}>Choose pickup Time</Text>
                                        : <Text style={{ color: '#1946A9', marginTop: 10, fontWeight: 'bold' }}>{time}</Text>

                                }
                            </TouchableOpacity>)
                        }

                        {/* Time Slot Selection Modal */}
                        <Modal isVisible={isTimeModalVisible} onBackdropPress={() => setTimeModalVisible(false)}>
                            <View style={{
                                backgroundColor: 'white',
                                borderRadius: 20,
                                padding: 20,
                                maxHeight: '70%',
                            }}>
                                <Text style={{ color: '#1946A9', fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>
                                    Select Time Slot (Today Only)
                                </Text>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                                        {availableTime.length > 0 ? (
                                            availableTime.map((slot, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={{
                                                        width: '30%',
                                                        padding: 12,
                                                        marginBottom: 10,
                                                        borderRadius: 10,
                                                        backgroundColor: time === slot ? '#1946A9' : '#f0f0f0',
                                                        alignItems: 'center',
                                                    }}
                                                    onPress={() => handleTimeSelect(slot)}
                                                >
                                                    <Text style={{
                                                        color: time === slot ? 'white' : '#333',
                                                        fontWeight: '600',
                                                    }}>{slot}</Text>
                                                </TouchableOpacity>
                                            ))
                                        ) : (
                                            <Text style={{ color: '#666', textAlign: 'center', width: '100%', padding: 20 }}>
                                                No more time slots available for today
                                            </Text>
                                        )}
                                    </View>
                                </ScrollView>
                                <TouchableOpacity
                                    style={{
                                        marginTop: 15,
                                        padding: 12,
                                        backgroundColor: '#ccc',
                                        borderRadius: 10,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => setTimeModalVisible(false)}
                                >
                                    <Text style={{ color: '#333', fontWeight: '600' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                        {
                            type === "homedelivery" && (<TouchableOpacity
                                onPress={() => {
                                    setModalState(2);
                                    setModalVisible(true);

                                }}
                            >
                                {
                                    (address === '')
                                        ? <Text style={{ color: '#1946A9', marginTop: 10, fontWeight: 'bold' }}>Choose delivery address </Text>
                                        : <Text style={{ color: '#1946A9', marginTop: 10, fontWeight: 'bold' }}>{address}</Text>

                                }
                            </TouchableOpacity>)
                        }

                    </View>
                    <Image source={bike} style={{
                        width: 140,
                        height: 100,
                        resizeMode: 'contain',

                    }} />
                </View>

                {
                    type === "homedelivery" && (
                        <View style={{
                            padding: 10,
                            marginTop: 20,
                        }} >
                            <Text
                                style={{ color: 'black', fontWeight: 'bold', fontSize: 17 }}
                            >Delivery Instructions</Text>
                            <Text style={{ color: 'black' }}>Let us know how we can help. You can share any specific
                                Needs, directions or delivery instructions</Text>

                            <View style={styles.inputViewMulti} >
                                <TextInput
                                    multiline={true}
                                    numberOfLines={5}
                                    style={styles.inputTextMulti}
                                    placeholder="e.g Please ring the doorbell next to the red door."
                                    placeholderTextColor="#878787"
                                    value={deliveryInstruction}
                                    onChangeText={(text) => setDeliveryInstruction(text)}
                                />
                            </View>
                        </View>
                    )
                }

                <View style={styles.bottomView}>
                    <TouchableOpacity style={styles.checkoutBtn} onPress={Done}>
                        <View style={styles.checkoutBtnContainer}>
                            <Text style={styles.checkoutBtnText}>Done</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </View >

    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    inputViewMulti: {
        width: "100%",
        borderColor: '#1946A9',
        borderWidth: 2,
        // backgroundColor: "#EEF1F0",
        borderRadius: 20,
        height: 140,
        // marginBottom: 20,
        marginTop: 30,
        // justifyContent: "center",
        alignItems: 'flex-start',
        padding: 10,

    },
    inputTextMulti: {
        // height: 50,
        color: "#1946A9"
    },
    bottomView: {
        width: '100%',
        // backgroundColor: 'green',
        alignItems: 'center',
    },
    checkoutBtn: {
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1946A9',
        padding: 10,
        marginTop: 10,
        borderRadius: 50,
    },
    checkoutBtnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
})

export default Slotbooked;
