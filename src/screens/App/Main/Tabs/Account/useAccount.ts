import { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import Toast from 'react-native-simple-toast';
import { useAppDispatch, useAppSelector } from '../../../../../redux/Hooks';
import { saveUser } from '../../../../../redux/auth/AuthSlice';
import { reset } from '../../../../../redux/bag/BagSlice';
import { DeleteUser, FetchUserAddresses, GetOrders } from '../../../../../helpers/Backend';

const fallbackImage =
  'https://firebasestorage.googleapis.com/v0/b/barber-2you.appspot.com/o/User%20Icon.png?alt=media&token=f6e510ad-487c-4501-bcc5-7019e1c60036';

const useAccount = () => {
  const user = useAppSelector((state: any) => state.user.value);
  const fav = useAppSelector((state: any) => state.user.fav);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    orders: 0,
    addresses: 0,
    favourites: 0,
  });

  const image = user?.userData?.image ? user.userData.image : fallbackImage;
  const name = user?.userData?.username || user?.userData?.name || 'Guest';
  const email = user?.userData?.email || '';

  const loadStats = useCallback(async () => {
    const userId = user?.userData?.id;
    if (!userId) return;

    try {
      const [ordersResponse, addressesResponse] = await Promise.all([
        GetOrders(userId),
        FetchUserAddresses(userId),
      ]);

      const orders = Array.isArray(ordersResponse) ? ordersResponse : [];
      const addresses = addressesResponse?.data?.data || [];

      setStats({
        orders: orders.length,
        addresses: Array.isArray(addresses) ? addresses.length : 0,
        favourites: Array.isArray(fav) ? fav.length : 0,
      });
    } catch (error) {
      setStats((prev) => ({
        ...prev,
        favourites: Array.isArray(fav) ? fav.length : 0,
      }));
    }
  }, [user?.userData?.id, fav]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
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
              setLoading(true);
              await DeleteUser('', user.userData.id);
              Toast.show('Account deleted successfully', 3);
              setLoading(false);
              setTimeout(() => {
                SignOut();
              }, 1000);
            } catch (error: any) {
              setLoading(false);
              Toast.show(error.message, 3);
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
    loading,
  };
};

export default useAccount;
