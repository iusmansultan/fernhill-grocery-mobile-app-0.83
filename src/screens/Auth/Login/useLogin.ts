import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../../redux/Hooks";
import { saveUser } from "../../../redux/auth/AuthSlice";
import {
    GetUserAddresses,
    SignInWithEmailAndPassword,
} from "../../../helpers/Backend";

const useLogin = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const ValidateFields = () => {
        if (email === "") {
            Alert.alert("Error", "Please enter your email");
            return false;
        }
        if (password === "") {
            Alert.alert("Error", "Please enter your password");
            return false;
        }
        return true;
    };

    const SignIn = async () => {
        const val = ValidateFields();
        if (val) {
            setLoading(true);
            const e = email.trim();
            try {
                const response: any = await SignInWithEmailAndPassword(e, password);
                const { user } = response.data.data;
                console.log("response =>", user);
                setLoading(false);
                const addressResponse: any = await GetUserAddresses(user.id);

                const data = {
                    isLoggedIn: true,
                    userData: {
                        ...user,
                        user_address: addressResponse.data,
                    },
                };
                dispatch(saveUser(data));
                setLoading(false);
                (navigation as any).replace("Main");
            } catch (err: any) {
                console.log("err =>", err);
                setLoading(false);
                Alert.alert("Error", "Invalid email or password");
            }
        } else {
            Alert.alert("Error", "Please fill all the fields");
        }
    };

    const ForgotUserPassword = () => {
        (navigation as any).navigate("ForgotPassword");
    };

    const navigateToSignUp = () => {
        (navigation as any).navigate("SignUp");
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        SignIn,
        ForgotUserPassword,
        navigateToSignUp,
        navigation,
    };
};

export default useLogin;
