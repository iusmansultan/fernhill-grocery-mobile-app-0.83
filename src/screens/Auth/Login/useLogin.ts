import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch } from '../../../redux/Hooks';
import { saveUser, saveToken } from '../../../redux/auth/AuthSlice';
import { fetchAddresses } from '../../../api/services';
import {
  useSignInMutation,
  useSocialLoginMutation,
} from '../../../api/hooks';
import { syncDeviceTokenWithBackend } from '../../../notifications/Notifications';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import { GOOGLE_WEB_CLIENT_ID } from '../../../helpers/Config';

/** Decode Apple/Google JWT payload without an extra dependency. */
const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );
    const json =
      typeof globalThis.atob === 'function'
        ? globalThis.atob(padded)
        : Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const signInMutation = useSignInMutation();
  const socialLoginMutation = useSocialLoginMutation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, []);

  const completeLogin = async (user: any, token: string) => {
    dispatch(saveToken(token));

    let userAddress: any[] = [];
    try {
      const addressResponse = await fetchAddresses(user.id);
      userAddress = addressResponse.data || [];
    } catch {
      // New social users may have no addresses yet
      userAddress = [];
    }

    dispatch(
      saveUser({
        isLoggedIn: true,
        userData: {
          ...user,
          user_address: userAddress,
        },
      })
    );
    await syncDeviceTokenWithBackend(user.id);
    (navigation as any).replace('Main');
  };

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
            await completeLogin(user, token);
          } catch {
            Alert.alert('Error', 'Failed to finish login');
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

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      await GoogleSignin.signOut().catch(() => undefined);

      const { data } = await GoogleSignin.signIn();
      const { user, idToken } = data as any;

      if (!user?.email || !user?.id) {
        throw new Error('Google did not return email/user id');
      }

      const response = await socialLoginMutation.mutateAsync({
        provider: 'google',
        providerId: String(user.id),
        email: user.email,
        name: user.name || null,
        givenName: user.givenName || null,
        familyName: user.familyName || null,
        profileImage: user.photo || null,
      });

      if (!response?.status || !response?.data) {
        throw new Error(response?.msg || 'Google sign-in failed');
      }

      await completeLogin(response.data.user, response.data.token);
      console.log('Google idToken =>', idToken);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return;
      }

      console.error(error);
      Alert.alert(
        'Google Sign-In Failed',
        error?.response?.data?.msg ||
          error?.message ||
          'Unable to sign in with Google'
      );
    }
  };

  const signInWithApple = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const {
        user: appleUserId,
        email: appleEmail,
        fullName,
        identityToken,
        authorizationCode,
      } = appleAuthRequestResponse;

      if (!identityToken) {
        throw new Error('Apple Sign-In failed - no identity token');
      }

      try {
        const credentialState =
          await appleAuth.getCredentialStateForUser(appleUserId);
        console.log('Apple credential state =>', credentialState);
      } catch (credentialError) {
        console.warn('Apple credential state check skipped', credentialError);
      }

      const tokenPayload = decodeJwtPayload(identityToken);
      const givenName = fullName?.givenName?.trim() || '';
      const familyName = fullName?.familyName?.trim() || '';
      const name = [givenName, familyName].filter(Boolean).join(' ') || null;
      const resolvedEmail = appleEmail || tokenPayload?.email || null;

      if (!resolvedEmail) {
        throw new Error(
          'Apple did not return an email. Remove this app from Sign in with Apple in Settings and try again.'
        );
      }

      const response = await socialLoginMutation.mutateAsync({
        provider: 'apple',
        providerId: appleUserId,
        email: resolvedEmail,
        name,
        givenName: givenName || null,
        familyName: familyName || null,
        profileImage: null,
      });

      if (!response?.status || !response?.data) {
        throw new Error(response?.msg || 'Apple sign-in failed');
      }

      console.log('Apple authorizationCode =>', authorizationCode);
      await completeLogin(response.data.user, response.data.token);
    } catch (error: any) {
      if (error?.code === appleAuth.Error.CANCELED) {
        return;
      }
      console.error(error);
      Alert.alert(
        'Apple Sign-In Failed',
        error?.response?.data?.msg ||
          error?.message ||
          'Unable to sign in with Apple'
      );
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading: signInMutation.isPending || socialLoginMutation.isPending,
    SignIn,
    ForgotUserPassword,
    navigateToSignUp,
    navigation,
    signInWithGoogle,
    signInWithApple,
  };
};

export default useLogin;
