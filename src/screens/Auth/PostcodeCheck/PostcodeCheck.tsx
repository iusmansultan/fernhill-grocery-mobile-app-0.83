import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import logo from "../../../assets/logo.png";
import styles from "./Styles";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import usePostcodeCheck from "./usePostcodeCheck";


const PostcodeCheck = () => {

    const { postcode, setPostcode, formatPostcode, loading, isValid, error, checkPostcode, continueToLogin } = usePostcodeCheck();

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Image source={logo} style={styles.logo} />

                <Text style={styles.title}>Welcome to Fernhill</Text>
                {
                    isValid ? null : (
                        <Text style={styles.subtitle}>
                            Enter your postcode to check if we deliver to your area
                        </Text>
                    )
                }

                {!isValid ? (
                    <>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Enter Postcode"
                                placeholderTextColor="#1946A9"
                                onChangeText={(text) => setPostcode(formatPostcode(text))}
                                value={postcode}
                                maxLength={7}
                                autoCapitalize="characters"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.checkBtn}
                            onPress={checkPostcode}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.checkBtnText}>Check Availability</Text>
                            )}
                        </TouchableOpacity>

                        {error !== "" && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}
                    </>
                ) : (
                    <View style={styles.successContainer}>
                        <Icon name="check-circle" size={60} color="#1946A9" style={styles.successIcon} />
                        <Text style={styles.successText}>
                            Great news! We deliver to your area.
                        </Text>

                        <TouchableOpacity
                            style={styles.continueBtn}
                            onPress={continueToLogin}
                        >
                            <Text style={styles.continueBtnText}>Continue to Shopping</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PostcodeCheck;
