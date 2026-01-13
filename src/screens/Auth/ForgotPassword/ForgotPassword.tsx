import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import styles from "./Styles";
import useForgotPassword from "./useForgotPassword";

const ForgotPassword = () => {
    const {
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
    } = useForgotPassword();

    if (screen === 1) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter the email associated with your account and we will send you a code to reset your password.
                </Text>

                <View>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="email@email.com"
                            placeholderTextColor={'#0066B1'}
                            onChangeText={(text) => setUsername(text)}
                            value={username}
                        />
                    </View>

                    <TouchableOpacity onPress={SendCode} style={styles.submitButton}>
                        {loading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>Send Code</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (screen === 2) {
        return (
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.title}>Create New Password</Text>
                    <Text style={styles.subtitle}>
                        Your new password must be different from your previous used password.
                    </Text>

                    <View>
                        <Text style={styles.label}>Code</Text>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Enter code"
                                placeholderTextColor={'#0066B1'}
                                onChangeText={(text) => setCode(text)}
                                value={code}
                            />
                        </View>
                        <Text style={styles.helperText}>Enter the code you received via email</Text>

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="**********"
                                placeholderTextColor={'#0066B1'}
                                secureTextEntry={true}
                                onChangeText={(text) => setPassword(text)}
                                value={password}
                            />
                        </View>
                        <Text style={styles.helperText}>
                            Password must be at least 8 characters with special characters
                        </Text>

                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="**********"
                                placeholderTextColor={'#0066B1'}
                                secureTextEntry={true}
                                onChangeText={(text) => setConfirmPassword(text)}
                                value={confirmPassword}
                            />
                        </View>
                        <Text style={styles.helperText}>Both password must be matched.</Text>

                        <TouchableOpacity onPress={ResetUserPassword} style={styles.submitButton}>
                            {loading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.submitButtonText}>Reset Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return null;
};

export default ForgotPassword;
