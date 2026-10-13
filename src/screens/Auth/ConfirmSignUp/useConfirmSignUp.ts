import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useVerifyOtpMutation } from '../../../api/hooks';

const CELL_COUNT = 6;
const SUCCESS_REDIRECT_MS = 2800;

const useConfirmSignUp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, uuid } = route.params as { email: string; uuid: string };
  const [value, setValue] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const verifyOtpMutation = useVerifyOtpMutation();

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const ConfirmSignUp = () => {
    if (value === '') return;

    verifyOtpMutation.mutate(
      { token: '', body: { email, otp: value } },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (e) => {
          console.log('e=>', e);
        },
      }
    );
  };

  useEffect(() => {
    if (!isSuccess) return;

    const timeout = setTimeout(() => {
      (navigation as any).replace('Login');
    }, SUCCESS_REDIRECT_MS);

    return () => clearTimeout(timeout);
  }, [isSuccess, navigation]);

  return {
    email,
    uuid,
    loading: verifyOtpMutation.isPending,
    isSuccess,
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
