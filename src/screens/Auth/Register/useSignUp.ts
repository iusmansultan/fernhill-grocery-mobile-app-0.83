import { useState } from "react";
import { SignUpWithEmailAndPassword } from "../../../helpers/Backend";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

const useSignUp = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (email !== "" && password !== "") {
            setLoading(true);

            try {
                const response: any = await SignUpWithEmailAndPassword(email, password);
                const { data } = response.data;
                console.log("response =>", data);
                setLoading(false);

                (navigation as any).navigate("ConfirmSignUp", {
                    email: data.email,
                    uuid: data.user_uuid,
                });
            } catch (e: any) {
                setLoading(false);
                Alert.alert(e.message);
            }
        } else {
            Alert.alert("Error", "Please fill all the fields");
        }
    };

    return {
        handleSignUp,
        email,
        setEmail,
        password,
        setPassword,
        loading,
        navigation
    }
}

export default useSignUp