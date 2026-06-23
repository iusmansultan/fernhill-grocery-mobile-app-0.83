import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  useForgotPasswordRequestMutation,
  useResetForgotPasswordMutation,
} from '../../../api/hooks';

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as {
    response?: { data?: { msg?: string; message?: string } };
    message?: string;
  };
  return (
    axiosError?.response?.data?.msg ||
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    fallback
  );
}

const useForgotPassword = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [screen, setScreen] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');

  const requestCodeMutation = useForgotPasswordRequestMutation();
  const resetPasswordMutation = useResetForgotPasswordMutation();

  const loading =
    requestCodeMutation.isPending || resetPasswordMutation.isPending;

  const SendCode = () => {
    const email = username.trim().toLowerCase();

    if (!email) {
      Alert.alert('Please enter email');
      return;
    }

    requestCodeMutation.mutate(email, {
      onSuccess: () => {
        setScreen(2);
        Alert.alert('Code sent', 'Check your email for the reset code.');
      },
      onError: (error) => {
        Alert.alert('Error', getErrorMessage(error, 'Failed to send reset code'));
      },
    });
  };

  const ResetUserPassword = () => {
    const email = username.trim().toLowerCase();
    const otp = code.trim();

    if (!otp || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    resetPasswordMutation.mutate(
      { email, otp, newPassword: password },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Your password has been reset. Please log in.', [
            {
              text: 'OK',
              onPress: () => (navigation as any).navigate('Login'),
            },
          ]);
        },
        onError: (error) => {
          Alert.alert(
            'Error',
            getErrorMessage(error, 'Failed to reset password')
          );
        },
      }
    );
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
