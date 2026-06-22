import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hooks";
import { saveUser } from "../../../../../redux/auth/AuthSlice";
import { reset } from "../../../../../redux/bag/BagSlice";

import awesomehistory from '../../../../../../src/assets/accountIcons/awesome-history.png';
import profile from '../../../../../../src/assets/accountIcons/profile.png';
import delivery from '../../../../../../src/assets/accountIcons/delivery.png';
// import payment from '../../../../../../src/assets/accountIcons/payment.png';
import help from '../../../../../../src/assets/accountIcons/help.png';
import { Alert } from "react-native";
import { DeleteUser } from "../../../../../helpers/Backend";
import Toast from "react-native-simple-toast";
import { useState } from "react";

const useAccount = () => {
    const user = useAppSelector((state: any) => state.user.value);
    const dispatch = useAppDispatch(); //dispatch
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const options = [
        { key: '2', label: 'Profile & Password', icon: profile },
        { key: '1', label: 'Order History', icon: awesomehistory },
        { key: '3', label: 'Delivery Address', icon: delivery },
        // { key: '4', label: 'Payment Methoods', icon: payment },
        { key: '8', label: 'Help', icon: help }
    ];
    const fallbackImage = "https://firebasestorage.googleapis.com/v0/b/barber-2you.appspot.com/o/User%20Icon.png?alt=media&token=f6e510ad-487c-4501-bcc5-7019e1c60036";
    const image = user?.userData?.image ? user.userData.image : fallbackImage;
    const name = user.userData.name;

    const SignOut = () => {
        // Auth.signOut()
        //     .then((res) => {
        const data = {
            isLoggedIn: false,
            userData: []
        }
        dispatch(saveUser(data));
        dispatch(reset(0));
        navigation.navigate('Login' as never);
        //     })
        //     .catch((err) => {
        //         console.log("err", err)
        //     })
    }

    const deleteAccount = async () => {
        Alert.alert('Delete Account', 'Are you sure you want to delete your account? Once account is deleted, you will not be able to recover it.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', onPress: async () => {
                    try {
                        setLoading(true);
                        await DeleteUser('', user.userData.id)
                        Toast.show("Account deleted successfully", 3);
                        setLoading(false);
                        setTimeout(() => {
                            SignOut();
                        }, 1000);
                    } catch (error: any) {
                        setLoading(false);
                        Toast.show(error.message, 3);
                        console.log("error", error)
                    }
                }
            }
        ]);
    }

    return {
        options,
        image,
        name,
        SignOut,
        navigation,
        deleteAccount,
        loading,
    }
}

export default useAccount
