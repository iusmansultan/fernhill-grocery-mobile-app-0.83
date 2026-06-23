import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAppDispatch } from "../../../redux/Hooks";
import { Alert } from "react-native";
import { saveStoreId, saveZip } from "../../../redux/auth/AuthSlice";
import { fetchStoreByZip } from "../../../api";

const usePostcodeCheck = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const [postcode, setPostcode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [isValid, setIsValid] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const formatPostcode = (text: string) => {
        const cleaned = text.replace(/\s/g, '').toUpperCase();
        if (cleaned.length > 3) {
            return cleaned.slice(0, 3) + ' ' + cleaned.slice(3);
        }
        return cleaned;
    };

    const checkPostcode = async () => {
        if (postcode.trim() === "") {
            Alert.alert("Error", "Please enter your postcode");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const result = await fetchStoreByZip(postcode, "");

            if (result.status) {
                setIsValid(true);
                dispatch(saveStoreId(result.data));
                dispatch(saveZip(postcode));
            } else {
                setError("Sorry, we are not available in your area yet. We have noted your interest and will be there soon!");
            }
        }catch(error) {
            console.log(error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const continueToLogin = () => {
        (navigation as any).navigate("Login");
    };

    return { postcode, setPostcode, navigation, dispatch, formatPostcode, loading, isValid, error, checkPostcode, continueToLogin };
};

export default usePostcodeCheck;