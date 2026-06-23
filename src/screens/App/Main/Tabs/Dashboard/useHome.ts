import { Alert } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/Hooks';
import { addItem } from '../../../../../redux/bag/BagSlice';
import { saveFav, saveStoreId, saveZip } from '../../../../../redux/auth/AuthSlice';
import { AddFav } from '../../../../../redux/fav/FavSlice';
import {
  useBannersQuery,
  useCartQuery,
  useDealsQuery,
  useFavoritesQuery,
  useFeaturedProductsQuery,
  useInfiniteProductsQuery,
  useStoreLookupMutation,
} from '../../../../../api/hooks';

const useHome = () => {
  const [isFeatured, setIsFeatured] = useState<boolean>(true);
  const [zip, setZip] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const pageSize = 10;

  const storeId = useAppSelector((state: any) => state.user.storeId);
  const fav = useAppSelector((state: any) => state.user.fav);
  const token = useAppSelector((state: any) => state.user.token);
  const user = useAppSelector((state: any) => state.user.value);
  const oldZip = useAppSelector((state: any) => state.user.zip);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (oldZip) setZip(oldZip);
  }, [oldZip]);

  const productsQuery = useInfiniteProductsQuery({ limit: pageSize }, true);
  const featuredQuery = useFeaturedProductsQuery(1, 20);
  const dealsQuery = useDealsQuery();
  const bannersQuery = useBannersQuery(storeId);
  const favoritesQuery = useFavoritesQuery(token, user?.userData?.id);
  const cartQuery = useCartQuery(token, user?.userData?.id);
  const storeLookup = useStoreLookupMutation();

  const products =
    productsQuery.data?.pages.flatMap((page) => page.data || []) || [];
  const pagination = productsQuery.data?.pages.at(-1)?.pagination ?? null;
  const featuredProducts = featuredQuery.data?.data || [];
  const deals = dealsQuery.data?.status ? dealsQuery.data.data || [] : [];
  const promoBanners = bannersQuery.data?.status
    ? bannersQuery.data.data || []
    : [];

  useEffect(() => {
    if (favoritesQuery.data) {
      dispatch(saveFav(favoritesQuery.data));
      dispatch(AddFav(favoritesQuery.data));
    }
  }, [favoritesQuery.data, dispatch]);

  useEffect(() => {
    if (cartQuery.data) {
      dispatch(addItem(cartQuery.data));
    }
  }, [cartQuery.data, dispatch]);

  const loadMoreProducts = useCallback(() => {
    if (productsQuery.hasNextPage && !productsQuery.isFetchingNextPage) {
      productsQuery.fetchNextPage();
    }
  }, [productsQuery]);

  const HandleAllProducts = useCallback(() => {
    setIsFeatured(false);
  }, []);

  const HandleFeaturedProducts = useCallback(() => {
    setIsFeatured(true);
  }, []);

  const onModalButtonPress = useCallback(() => {
    if (zip === '') {
      Alert.alert('Please enter postal code');
      return;
    }

    storeLookup.mutate(
      { zip, token },
      {
        onSuccess: (res) => {
          if (res.status) {
            dispatch(saveStoreId(res.data));
            dispatch(saveZip(zip));
            productsQuery.refetch();
            setIsModalVisible(false);
          } else {
            Alert.alert(
              'Sorry',
              'We are not in your area. We have noted, and we will be there soon.'
            );
          }
        },
        onError: (err: any) => {
          Alert.alert(err?.message || 'Something went wrong');
        },
      }
    );
  }, [zip, token, storeLookup, dispatch, productsQuery]);

  return {
    isFeatured,
    products,
    featuredProducts,
    loading: productsQuery.isLoading,
    loadingMore: productsQuery.isFetchingNextPage,
    fav,
    deals,
    promoBanners,
    dealsLoading: dealsQuery.isLoading,
    pagination,
    HandleAllProducts,
    HandleFeaturedProducts,
    loadMoreProducts,
    zip,
    isModalVisible,
    loadZip: storeLookup.isPending,
    setLoadZip: () => {},
    setIsModalVisible,
    setZip,
    onModalButtonPress,
  };
};

export default useHome;
