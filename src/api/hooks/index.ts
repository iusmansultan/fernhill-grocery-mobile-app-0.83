import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import {
  fetchCategories,
  fetchProducts,
  fetchFeaturedProducts,
  fetchActiveDeals,
  fetchActiveBanners,
  fetchUserCart,
  fetchFavorites,
  fetchOrders,
  fetchAddresses,
  fetchStoreByZip,
  deleteProductFromCart,
  deleteDealFromCart,
  addProductToCart,
  addDealToCart,
  addAddress,
  removeAddress,
  setDefaultAddress,
  checkoutCart,
  createOrder,
  signIn,
  signUp,
  verifyOtp,
  requestForgotPassword,
  resetForgotPassword,
  deleteUser,
} from '../services';
import type { AddAddressBody, ProductListParams } from '../types';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: fetchCategories,
  });
}

export function useProductsQuery(params: ProductListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.list(params),
    queryFn: () => fetchProducts(params),
    enabled,
  });
}

export function useInfiniteProductsQuery(
  baseParams: Omit<ProductListParams, 'page'>,
  enabled = true
) {
  const limit = baseParams.limit ?? 10;

  return useInfiniteQuery({
    queryKey: ['products', 'infinite', baseParams] as const,
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({ ...baseParams, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.pagination?.hasMore ? lastPageParam + 1 : undefined,
    enabled,
  });
}

export function useFeaturedProductsQuery(page = 1, limit = 10) {
  return useQuery({
    queryKey: queryKeys.products.featured(page, limit),
    queryFn: () => fetchFeaturedProducts(page, limit),
  });
}

export function useDealsQuery() {
  return useQuery({
    queryKey: queryKeys.deals.active,
    queryFn: fetchActiveDeals,
  });
}

export function useBannersQuery(storeId?: string | number | null) {
  return useQuery({
    queryKey: queryKeys.banners(storeId),
    queryFn: () => fetchActiveBanners(storeId),
  });
}

export function useCartQuery(
  token: string | null | undefined,
  userId: string | number | null | undefined
) {
  return useQuery({
    queryKey: queryKeys.cart(userId ?? 'guest'),
    queryFn: () => fetchUserCart(token!, userId!),
    enabled: Boolean(token && userId),
  });
}

export function useFavoritesQuery(
  token: string | null | undefined,
  userId: string | number | null | undefined
) {
  return useQuery({
    queryKey: queryKeys.favorites(userId ?? 'guest'),
    queryFn: () => fetchFavorites(token!, userId!),
    enabled: Boolean(token && userId),
  });
}

export function useOrdersQuery(userId: string | number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.orders(userId ?? 'guest'),
    queryFn: () => fetchOrders(userId!),
    enabled: Boolean(userId),
  });
}

export function useAddressesQuery(userId: string | number | null | undefined) {
  return useQuery({
    queryKey: queryKeys.addresses(userId ?? 'guest'),
    queryFn: () => fetchAddresses(userId!),
    enabled: Boolean(userId),
  });
}

export function useStoreLookupMutation() {
  return useMutation({
    mutationFn: ({ zip, token }: { zip: string; token: string }) =>
      fetchStoreByZip(zip, token),
  });
}

export function useRemoveFromCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      productId,
      userId,
    }: {
      token: string;
      productId: string | number;
      userId: string | number;
    }) => deleteProductFromCart(token, productId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart(variables.userId),
      });
    },
  });
}

export function useRemoveDealFromCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      dealId,
      userId,
    }: {
      token: string;
      dealId: string | number;
      userId: string | number;
    }) => deleteDealFromCart(token, dealId, userId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.cart(variables.userId),
      });
    },
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      body,
      userId,
    }: {
      token: string;
      body: Record<string, unknown>;
      userId: string | number;
    }) => addProductToCart(token, body).then(() => userId),
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId) });
    },
  });
}

export function useAddDealToCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      body,
      userId,
    }: {
      token: string;
      body: Record<string, unknown>;
      userId: string | number;
    }) => addDealToCart(token, body).then(() => userId),
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId) });
    },
  });
}

export function useAddAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      body,
    }: {
      token: string;
      body: AddAddressBody;
    }) => addAddress(token, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.addresses(variables.body.userId),
      });
    },
  });
}

export function useRemoveAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      addressId,
      userId,
    }: {
      token: string;
      addressId: string | number;
      userId: string | number;
    }) => removeAddress(token, addressId).then(() => userId),
    onSuccess: (userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses(userId) });
    },
  });
}

export function useSetDefaultAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      token,
      userId,
      addressId,
    }: {
      token: string;
      userId: string | number;
      addressId: string | number;
    }) => setDefaultAddress(token, userId, addressId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.addresses(variables.userId),
      });
    },
  });
}

export function useCheckoutMutation() {
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => checkoutCart(data),
  });
}

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Record<string, unknown>) => createOrder(data),
    onSuccess: (_data, variables) => {
      const userId = variables.user_id as string | number | undefined;
      if (userId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.orders(userId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId) });
      }
    },
  });
}

export function useSignInMutation() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),
  });
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signUp(email, password),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: ({
      token,
      body,
    }: {
      token: string;
      body: Record<string, unknown>;
    }) => verifyOtp(token, body),
  });
}

export function useForgotPasswordRequestMutation() {
  return useMutation({
    mutationFn: (email: string) => requestForgotPassword(email),
  });
}

export function useResetForgotPasswordMutation() {
  return useMutation({
    mutationFn: ({
      email,
      otp,
      newPassword,
    }: {
      email: string;
      otp: string;
      newPassword: string;
    }) => resetForgotPassword(email, otp, newPassword),
  });
}

export function useDeleteUserMutation() {
  return useMutation({
    mutationFn: ({
      token,
      userId,
    }: {
      token: string;
      userId: string | number;
    }) => deleteUser(token, userId),
  });
}
