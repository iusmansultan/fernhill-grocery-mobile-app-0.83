import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const useForgotPassword = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [screen, setScreen] = useState(1);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');

    const SendCode = () => {
        setLoading(true);
        if (username.length > 0) {
            // API call would go here
            setLoading(false);
            setScreen(2);
        } else {
            setLoading(false);
            Alert.alert("Please enter email");
        }
    };

    const ResetUserPassword = () => {
        if (password !== '' && confirmPassword !== '' && code !== '') {
            setLoading(true);
            if (password === confirmPassword) {
                // API call would go here
                setLoading(false);
                (navigation as any).pop();
            } else {
                setLoading(false);
                Alert.alert('Passwords not matched');
            }
        } else {
            Alert.alert('please enter both fields');
        }
    };

    return {
        username,
        setUsername,
        loading,
        screen,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        code,
        setCode,
        SendCode,
        ResetUserPassword,
        navigation,
    };
};

export default useForgotPassword;
