import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../redux/Hooks';
import { saveUser, saveToken } from '../../../redux/auth/AuthSlice';
import { fetchAddresses } from '../../../api/services';
import { useSignInMutation } from '../../../api/hooks';
import { syncDeviceTokenWithBackend } from '../../../notifications/Notifications';

const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signInMutation = useSignInMutation();

  const ValidateFields = () => {
    if (email === '') {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (password === '') {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }
    return true;
  };

  const SignIn = async () => {
    const val = ValidateFields();
    if (!val) {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    const e = email.trim();
    signInMutation.mutate(
      { email: e, password },
      {
        onSuccess: async (response) => {
          try {
            const { user, token } = response.data;
            dispatch(saveToken(token));

            const addressResponse = await fetchAddresses(user.id);

            const data = {
              isLoggedIn: true,
              userData: {
                ...user,
                user_address: addressResponse.data,
              },
            };
            dispatch(saveUser(data));
            await syncDeviceTokenWithBackend(user.id);
            (navigation as any).replace('Main');
          } catch {
            Alert.alert('Error', 'Failed to load user addresses');
          }
        },
        onError: () => {
          Alert.alert('Error', 'Invalid email or password');
        },
      }
    );
  };

  const ForgotUserPassword = () => {
    (navigation as any).navigate('ForgotPassword');
  };

  const navigateToSignUp = () => {
    (navigation as any).navigate('SignUp');
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading: signInMutation.isPending,
    SignIn,
    ForgotUserPassword,
    navigateToSignUp,
    navigation,
  };
};

export default useLogin;
