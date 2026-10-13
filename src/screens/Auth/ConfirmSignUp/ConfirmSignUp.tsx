import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import {
    CodeField,
    Cursor,
} from 'react-native-confirmation-code-field';
import LottieView from 'lottie-react-native';
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
        loading,
        isSuccess,
    } = useConfirmSignUp();

    if (isSuccess) {
        return (
            <View style={styles.successRoot}>
                <LottieView
                    source={require('../../../assets/success-check.json')}
                    autoPlay
                    loop={false}
                    style={styles.successLottie}
                />
                <Text style={styles.successTitle}>Account created</Text>
                <Text style={styles.successDescription}>
                    Your account is ready. Taking you to login...
                </Text>
            </View>
        );
    }

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

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleConfirm}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Confirm</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default ConfirmSignUp;
