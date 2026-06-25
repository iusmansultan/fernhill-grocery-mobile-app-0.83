import type { QueryClient } from '@tanstack/react-query';
import { queryKeys } from './queryKeys';
import {
  fetchActiveBanners,
  fetchActiveDeals,
  fetchAddresses,
  fetchCategories,
  fetchFeaturedProducts,
  fetchFavorites,
  fetchProducts,
  fetchUserCart,
} from './services';
import { store } from '../redux/Store';
import { addItem } from '../redux/bag/BagSlice';
import { saveFav } from '../redux/auth/AuthSlice';
import { AddFav } from '../redux/fav/FavSlice';

const HOME_PAGE_SIZE = 10;
const FEATURED_LIMIT = 20;

export type AppUserState = {
  value?: {
    isLoggedIn?: boolean;
    userData?: { id?: number };
  };
  token?: string;
  storeId?: string | number;
  store_id?: string | number;
};

function getStoreId(userState: AppUserState) {
  return userState.storeId ?? userState.store_id ?? '1';
}

function hydrateReduxFromCache(
  client: QueryClient,
  userId: string | number
) {
  const cart = client.getQueryData(queryKeys.cart(userId));
  if (cart) {
    store.dispatch(addItem(cart));
  }

  const favorites = client.getQueryData(queryKeys.favorites(userId));
  if (favorites) {
    store.dispatch(saveFav(favorites));
    store.dispatch(AddFav(favorites));
  }
}

export async function prefetchAppData(
  client: QueryClient,
  userState: AppUserState
): Promise<void> {
  const isLoggedIn = Boolean(userState.value?.isLoggedIn);
  const userId = userState.value?.userData?.id;
  const token = userState.token;
  const storeId = getStoreId(userState);

  const tasks: Promise<unknown>[] = [
    client.prefetchQuery({
      queryKey: queryKeys.categories.all,
      queryFn: fetchCategories,
    }),
    client.prefetchInfiniteQuery({
      queryKey: ['products', 'infinite', { limit: HOME_PAGE_SIZE }],
      queryFn: ({ pageParam = 1 }) =>
        fetchProducts({ limit: HOME_PAGE_SIZE, page: pageParam }),
      initialPageParam: 1,
    }),
    client.prefetchQuery({
      queryKey: queryKeys.products.featured(1, FEATURED_LIMIT),
      queryFn: () => fetchFeaturedProducts(1, FEATURED_LIMIT),
    }),
    client.prefetchQuery({
      queryKey: queryKeys.deals.active,
      queryFn: fetchActiveDeals,
    }),
    client.prefetchQuery({
      queryKey: queryKeys.banners(storeId),
      queryFn: () => fetchActiveBanners(storeId),
    }),
  ];

  if (isLoggedIn && userId && token) {
    tasks.push(
      client.prefetchQuery({
        queryKey: queryKeys.cart(userId),
        queryFn: () => fetchUserCart(token, userId),
      }),
      client.prefetchQuery({
        queryKey: queryKeys.favorites(userId),
        queryFn: () => fetchFavorites(token, userId),
      }),
      client.prefetchQuery({
        queryKey: queryKeys.addresses(userId),
        queryFn: () => fetchAddresses(userId),
      })
    );
  }

  await Promise.allSettled(tasks);

  if (userId) {
    hydrateReduxFromCache(client, userId);
  }
}
