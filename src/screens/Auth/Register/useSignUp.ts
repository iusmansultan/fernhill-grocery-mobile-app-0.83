import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useSignUpMutation } from '../../../api/hooks';

const useSignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signUpMutation = useSignUpMutation();

  const handleSignUp = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill all the fields');
      return;
    }

    signUpMutation.mutate(
      { email, password },
      {
        onSuccess: (response: any) => {
          const { data } = response;
          (navigation as any).navigate('ConfirmSignUp', {
            email: data.email,
            uuid: data.user_uuid,
          });
        },
        onError: (e: any) => {
          Alert.alert(e?.message || 'Sign up failed');
        },
      }
    );
  };

  return {
    handleSignUp,
    email,
    setEmail,
    password,
    setPassword,
    loading: signUpMutation.isPending,
    navigation,
  };
};

export default useSignUp;
