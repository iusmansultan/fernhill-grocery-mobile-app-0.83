import { useCallback, useMemo } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import Toast from 'react-native-simple-toast';
import { useAppDispatch, useAppSelector } from '../../../../../redux/Hooks';
import { saveUser } from '../../../../../redux/auth/AuthSlice';
import { reset } from '../../../../../redux/bag/BagSlice';
import {
  useAddressesQuery,
  useDeleteUserMutation,
  useOrdersQuery,
} from '../../../../../api/hooks';

const fallbackImage =
  'https://firebasestorage.googleapis.com/v0/b/barber-2you.appspot.com/o/User%20Icon.png?alt=media&token=f6e510ad-487c-4501-bcc5-7019e1c60036';

const useAccount = () => {
  const user = useAppSelector((state: any) => state.user.value);
  const token = useAppSelector((state: any) => state.user.token);
  const fav = useAppSelector((state: any) => state.user.fav);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const userId = user?.userData?.id;

  const { data: orders = [], refetch: refetchOrders } = useOrdersQuery(userId);
  const { data: addressesResponse, refetch: refetchAddresses } =
    useAddressesQuery(userId);
  const deleteUserMutation = useDeleteUserMutation();

  const image = user?.userData?.image ? user.userData.image : fallbackImage;
  const name = user?.userData?.username || user?.userData?.name || 'Guest';
  const email = user?.userData?.email || '';

  const stats = useMemo(() => {
    const addresses = addressesResponse?.data || [];
    return {
      orders: Array.isArray(orders) ? orders.length : 0,
      addresses: Array.isArray(addresses) ? addresses.length : 0,
      favourites: Array.isArray(fav) ? fav.length : 0,
    };
  }, [orders, addressesResponse?.data, fav]);

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        refetchOrders();
        refetchAddresses();
      }
    }, [userId, refetchOrders, refetchAddresses])
  );

  const settingsOptions = [
    {
      key: 'profile',
      label: 'Profile & password',
      icon: 'account-outline',
      screen: 'Profile',
    },
    {
      key: 'orders',
      label: 'Order history',
      icon: 'history',
      screen: 'OrderHistory',
      badge: stats.orders,
    },
    {
      key: 'address',
      label: 'Delivery address',
      icon: 'truck-delivery-outline',
      screen: 'Address',
    },
    {
      key: 'help',
      label: 'Help & support',
      icon: 'help-circle-outline',
      screen: 'Help',
    },
  ];

  const navigateTo = (screen: string) => {
    navigation.navigate(screen as never);
  };

  const SignOut = () => {
    const data = {
      isLoggedIn: false,
      userData: [],
    };
    dispatch(saveUser(data));
    dispatch(reset(0));
    navigation.navigate('Login' as never);
  };

  const deleteAccount = async () => {
    Alert.alert(
      'Delete account',
      'Are you sure you want to delete your account? Once deleted, you will not be able to recover it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserMutation.mutateAsync({
                token: token || '',
                userId,
              });
              Toast.show('Account deleted successfully', 3);
              setTimeout(() => {
                SignOut();
              }, 1000);
            } catch (error: any) {
              Toast.show(error?.message || 'Failed to delete account', 3);
            }
          },
        },
      ]
    );
  };

  return {
    image,
    name,
    email,
    stats,
    settingsOptions,
    navigateTo,
    SignOut,
    deleteAccount,
    loading: deleteUserMutation.isPending,
  };
};

export default useAccount;
