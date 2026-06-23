import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../../../../redux/Hooks';
import { removeItem } from '../../../../../redux/bag/BagSlice';
import {
  useRemoveDealFromCartMutation,
  useRemoveFromCartMutation,
} from '../../../../../api/hooks';

const useBag = () => {
  const token = useAppSelector((state: any) => state.user.token);
  const user = useAppSelector((state: any) => state.user.value);
  const cart = useAppSelector((state: any) => state.bag.value);
  const total = useAppSelector((state: any) => state.bag.total);

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const removeProductMutation = useRemoveFromCartMutation();
  const removeDealMutation = useRemoveDealFromCartMutation();
  const [refreshing, _setRefreshing] = useState(false);

  const loading =
    removeProductMutation.isPending || removeDealMutation.isPending;

  const RemoveProduct = (id: string | number) => {
    const uid = user.userData.id;

    removeProductMutation.mutate(
      { token, productId: id, userId: uid },
      {
        onSuccess: (res) => {
          dispatch(removeItem(res));
        },
      }
    );
  };

  const removeDealFromCart = (dealId: number) => {
    const uid = user.userData.id;

    removeDealMutation.mutate(
      { token, dealId, userId: uid },
      {
        onSuccess: (res) => {
          dispatch(removeItem(res));
        },
      }
    );
  };

  const CheckOut = () => {
    (navigation as any).navigate('BookASlot');
  };

  const RemoveAllProduct = () => {
    const uid = user.userData.id;

    cart.forEach((item: any) => {
      removeProductMutation.mutate(
        { token, productId: item.product_id, userId: uid },
        {
          onSuccess: (res) => {
            dispatch(removeItem(res));
          },
        }
      );
    });
  };

  const ClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear your cart?', [
      { text: 'Cancel', onPress: () => {}, style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          RemoveAllProduct();
        },
      },
    ]);
  };

  const onRefresh = () => {};

  return {
    token,
    user,
    cart,
    total,
    loading,
    refreshing,
    navigation,
    RemoveProduct,
    CheckOut,
    ClearCart,
    onRefresh,
    removeDealFromCart,
  };
};

export default useBag;
