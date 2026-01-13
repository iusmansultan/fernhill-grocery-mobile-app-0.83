/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert } from 'react-native';
import { useAppSelector } from '../../../redux/Hooks';
import bike from '../../../assets/bike.png';
import Modal from "react-native-modal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FetchUserAddresses } from '../../../helpers/Backend';

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
            setAddresses(response.data.data)
            console.log(response)
        } catch (e) {
            console.log(e)
        }
    }

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);


    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        // console.warn("A date has been picked: ", date.getHours());
        // console.warn("A date has been picked: ", date.getMinutes());
        const getHr = date.getHours();

        console.log('get hr', getHr);
        console.log('current time', currentTime);

        // if (getHr <= currentTime) {
        //     Alert.alert('Please Chooose correct time');
        // }
        // else {
        setTime(date.getHours().toString() + ':' + date.getMinutes().toString())
        hideDatePicker();
        // }
    };

    useEffect(() => {
        // console.log("**********", user.userData.user_address)
        if (user.userData.user_address === null) {
            navigation.navigate('Address');
        }
        const tempTime = []
        for (let i = currentTime + 1; i <= 24; i++) {
            const obj = {
                hr: i,
                mint: [
                    "00",
                    "15",
                    "30",
                    "45"
                ]
            }
            tempTime.push(obj)
        }
        setAvailableTime(tempTime)
    }, [])

    const Done = () => {
        if (time === '' || address === '') {
            Alert.alert('Error', 'Please enter your delivery instructions and time slot and address')
        } else {
            console.log("addressId", addressId);
            console.log("address", address);

            navigation.navigate('CheckOutSummary', {
                type: type,
                address: address,
                date: date,
                time: time,
                deliveryInstruction: deliveryInstruction,
                bag: bag,
                addressId: addressId
            })
        }
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

    if (type === 'homedelivery') {
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
                            <Text style={{ color: '#0066B1', fontWeight: 'bold', fontSize: 20 }}>Home Delivery</Text>
                            <Text style={{ color: '#0066B1', marginTop: 10, fontWeight: 'bold' }}>{date}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setDatePickerVisibility(true)
                                }}
                            >
                                {
                                    (time === '')
                                        ? <Text style={{ color: '#0066B1', marginTop: 10, fontWeight: 'bold' }}>Choose delivery Time</Text>
                                        : <Text style={{ color: '#0066B1', marginTop: 10, fontWeight: 'bold' }}>{time}</Text>

                                }
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="time"
                                is24Hour={true}
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setModalState(2);
                                    setModalVisible(true);

                                }}
                            >
                                {
                                    (address === '')
                                        ? <Text style={{ color: '#0066B1', marginTop: 10, fontWeight: 'bold' }}>Choose delivery address </Text>
                                        : <Text style={{ color: '#0066B1', marginTop: 10, fontWeight: 'bold' }}>{address}</Text>

                                }
                            </TouchableOpacity>



                        </View>
                        <Image source={bike} style={{
                            width: 140,
                            height: 100,
                            resizeMode: 'contain',

                        }} />
                    </View>

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
    else if (type === 'pickup') {
        return (
            <View>
                <Text>type: {type} </Text>
            </View>
        );

    }


    return (
        <View>
            <Text>No delivery type choosed </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    inputViewMulti: {
        width: "100%",
        borderColor: '#0066B1',
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
        color: "#0066B1"
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
        backgroundColor: '#0066B1',
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
