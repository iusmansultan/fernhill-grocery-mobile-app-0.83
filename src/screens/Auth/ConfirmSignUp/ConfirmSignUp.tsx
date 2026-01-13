import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
    CodeField,
    Cursor,
} from 'react-native-confirmation-code-field';
import ccode from '../../../../src/assets/ccode.jpg';
import styles from "./Styles";
import useConfirmSignUp from "./useConfirmSignUp";

const ConfirmSignUp = () => {
    const {
        value,
        setValue,
        ref,
        props,
        getCellOnLayoutHandler,
        ConfirmSignUp: handleConfirm,
        CELL_COUNT,
    } = useConfirmSignUp();

    return (
        <View style={styles.root}>
            <Image source={ccode} style={styles.logo} />
            <Text style={styles.title}>Verification</Text>
            <Text style={styles.description}>
                please enter verification code we sent to your email
            </Text>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                    <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}>
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                )}
            />

            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ConfirmSignUp;
