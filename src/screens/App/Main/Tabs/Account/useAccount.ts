import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../../../redux/Hooks";
import { saveUser } from "../../../../../redux/auth/AuthSlice";
import { reset } from "../../../../../redux/bag/BagSlice";

import awesomehistory from '../../../../../../src/assets/accountIcons/awesome-history.png';
import profile from '../../../../../../src/assets/accountIcons/profile.png';
import delivery from '../../../../../../src/assets/accountIcons/delivery.png';
import payment from '../../../../../../src/assets/accountIcons/payment.png';
import help from '../../../../../../src/assets/accountIcons/help.png';

const useAccount = () => {
    const user = useAppSelector((state: any) => state.user.value);
    const dispatch = useAppDispatch(); //dispatch
    const navigation = useNavigation();

    const options = [
        { key: '1', label: 'Order History', icon: awesomehistory },
        { key: '2', label: 'Profile & Password', icon: profile },
        { key: '3', label: 'Delivery Address', icon: delivery },
        { key: '4', label: 'Payment Methoods', icon: payment },
        { key: '8', label: 'Help', icon: help }
    ];

    const image = `https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png`;
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

    return {
        options,
        image,
        name,
        SignOut,
        navigation
    }
}

export default useAccount
