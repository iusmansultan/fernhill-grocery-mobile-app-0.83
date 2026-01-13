import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { VerifyUserAccount } from "../../../helpers/Backend";

const CELL_COUNT = 6;

const useConfirmSignUp = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email, uuid } = route.params as { email: string; uuid: string };
    const [loading, _setLoading] = useState(false);
    const [value, setValue] = useState('');

    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });

    const ConfirmSignUp = async () => {
        const body = {
            email,
            otp: value
        }
        if (value !== "") {
            try {
                await VerifyUserAccount("", body);
                (navigation as any).replace("Login");
            } catch (e) {
                console.log("e=>", e);
            }
        }
    };

    return {
        email,
        uuid,
        loading,
        value,
        setValue,
        ref,
        props,
        getCellOnLayoutHandler,
        ConfirmSignUp,
        CELL_COUNT,
    };
};

export default useConfirmSignUp;

