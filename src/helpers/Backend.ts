/**
 * Legacy API helpers — thin wrappers around typed services for JS screens
 * not yet migrated to React Query. Prefer importing from `../api`.
 */
import { apiClient, authHeaders } from '../api/client';
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchCategories,
  fetchProductDetails,
  fetchFeaturedProducts,
  fetchUserCart,
  addProductToCart,
  addDealToCart,
  deleteProductFromCart,
  deleteDealFromCart,
  checkoutCart,
  createOrder,
  fetchOrders,
  fetchAddresses,
  addAddress,
  removeAddress,
  setDefaultAddress,
  fetchFavorites,
  addFavorite,
  removeFavorite,
  fetchActiveDeals,
  fetchActiveBanners,
  fetchStoreByZip,
  signIn,
  signUp,
  verifyOtp,
  createUser,
  updateUserInfo,
  updateUserImage,
  updateUserDetailsWithImage,
  deleteUser,
} from '../api/services';
import type { AddAddressBody, ProductListParams } from '../api/types';

type LegacyResult<T> = T | unknown;

async function legacy<T>(fn: () => Promise<T>): Promise<LegacyResult<T>> {
  try {
    return await fn();
  } catch (error) {
    return error;
  }
}

const getProducts = async (
  arg1?: ProductListParams | string | number | null,
  arg2?: number,
  arg3?: number
): Promise<LegacyResult<{ data: Awaited<ReturnType<typeof fetchProducts>> }>> => {
  let params: ProductListParams = { page: 1, limit: 10 };

  const isOptionsObject =
    arg1 !== null &&
    typeof arg1 === 'object' &&
    !Array.isArray(arg1) &&
    ('page' in arg1 ||
      'limit' in arg1 ||
      'search' in arg1 ||
      'categoryId' in arg1);

  if (isOptionsObject) {
    params = arg1 as ProductListParams;
  } else {
    params = { page: arg2 ?? 1, limit: arg3 ?? 10 };
  }

  return legacy(async () => ({ data: await fetchProducts(params) }));
};

const getProductsByCategory = async (
  id: string | number,
  page = 1,
  limit = 10
) =>
  legacy(async () => ({
    data: await fetchProductsByCategory(id, page, limit),
  }));

const getCategories = async () =>
  legacy(async () => ({ data: await fetchCategories() }));

const GetSignedUserDetails = async (_token: string) => ({
  data: {
    status: true,
    message: 'success',
    data: { list: [] },
  },
});

const GetFavProducts = async (token: string, id: string | number) =>
  legacy(async () => ({
    data: { data: await fetchFavorites(token, id) },
  }));

const GetUserCart = async (token: string, id: string | number) =>
  legacy(async () => ({
    data: { data: await fetchUserCart(token, id) },
  }));

const AddProductToCart = async (token: string, body: Record<string, unknown>) =>
  legacy(() => addProductToCart(token, body));

const AddDealToCart = async (token: string, body: Record<string, unknown>) =>
  legacy(() => addDealToCart(token, body));

const DeleteUser = async (token: string, userId: string | number) =>
  legacy(() => deleteUser(token, userId));

const GetProductDetails = async (token: string, id: string | number) =>
  legacy(async () => ({ data: await fetchProductDetails(token, id) }));

const CreateUser = async (body: Record<string, unknown>) =>
  legacy(() => createUser(body));

const UpdateUserInfo = async (token: string, body: Record<string, unknown>) =>
  legacy(async () => {
    const dbResponse = await updateUserInfo(token, body);
    if ((dbResponse as { status?: boolean }).status) {
      const response = await GetSignedUserDetails(token);
      return response.data.data.list;
    }
    return undefined;
  });

const UpdateUserImage = async (
  token: string,
  imageAsset: { uri: string; type?: string; fileName?: string },
  userId: string | number
) => legacy(() => updateUserImage(token, imageAsset, userId));

const UpdateUserDetailsWithImage = async (
  token: string,
  details: Record<string, unknown>
) => legacy(() => updateUserDetailsWithImage(token, details));

const AddUserAddress = async (token: string, body: AddAddressBody) =>
  legacy(() => addAddress(token, body));

const GetUserAddresses = async (userId: string | number) =>
  legacy(() => fetchAddresses(userId));

const DeleteProductFromCart = async (
  token: string,
  pid: string | number,
  uid: string | number
) => legacy(() => deleteProductFromCart(token, pid, uid));

const DeleteDealFromCart = async (
  token: string,
  dId: string | number,
  uid: string | number
) => legacy(() => deleteDealFromCart(token, dId, uid));

const CheckOutCart = async (data: Record<string, unknown>) =>
  legacy(() => checkoutCart(data));

const AddOrder = async (data: Record<string, unknown>) =>
  legacy(() => createOrder(data));

const GetOrders = async (id: string | number, _token?: string) =>
  legacy(() => fetchOrders(id));

const GetSetupIntent = async (_token: string) => {
  const response = await GetSignedUserDetails(_token);
  return response.data.data.list;
};

const DeleteUserCard = async (token: string, id: string | number) => {
  try {
    await apiClient.delete(`/cards/${id}`, { headers: authHeaders(token) });
    const response = await GetSignedUserDetails(token);
    return response.data.data.list;
  } catch (error) {
    return error;
  }
};

const SetToken = async (_body: Record<string, unknown>) => ({
  status: true,
  message: 'success',
});

const AddProdToFav = async (token: string, body: Record<string, unknown>) =>
  legacy(() => addFavorite(token, body));

const RemoveProdToFav = async (token: string, body: Record<string, unknown>) =>
  legacy(() => removeFavorite(token, body));

const RemoveAddress = async (token: string, id: string | number) => {
  try {
    await removeAddress(token, id);
    const response = await GetSignedUserDetails(token);
    return response.data.data.list;
  } catch (error) {
    return error;
  }
};

const SetDefaultAddress = async (
  token: string,
  userId: string | number,
  addressId: string | number
) => legacy(() => setDefaultAddress(token, userId, addressId));

const VerifyPromoCode = async (token: string, body: Record<string, unknown>) =>
  legacy(() =>
    apiClient.post('/verifyPromo', body, { headers: authHeaders(token) })
  );

const VerifyUserAccount = async (token: string, body: Record<string, unknown>) =>
  legacy(() => verifyOtp(token, body));

const GetFeaturedProducts = async (page = 1, limit = 10) =>
  legacy(async () => ({ data: await fetchFeaturedProducts(page, limit) }));

const GetActiveDeals = async () =>
  legacy(async () => ({ data: await fetchActiveDeals() }));

const GetActivePromotionalBanners = async (storeId?: string | number) =>
  legacy(async () => ({ data: await fetchActiveBanners(storeId) }));

const FetchUserAddresses = async (id: string | number) =>
  legacy(async () => ({ data: await fetchAddresses(id) }));

const SignUpWithEmailAndPassword = async (email: string, password: string) =>
  legacy(() => signUp(email, password));

const SignInWithEmailAndPassword = async (email: string, password: string) =>
  legacy(async () => ({ data: await signIn(email, password) }));

export {
  SignInWithEmailAndPassword,
  SignUpWithEmailAndPassword,
  getProducts,
  getCategories,
  getProductsByCategory,
  GetSignedUserDetails,
  GetFavProducts,
  GetUserCart,
  AddProductToCart,
  GetProductDetails,
  CreateUser,
  UpdateUserInfo,
  AddUserAddress,
  DeleteProductFromCart,
  CheckOutCart,
  AddOrder,
  GetOrders,
  GetSetupIntent,
  DeleteUserCard,
  SetToken,
  AddProdToFav,
  RemoveAddress,
  SetDefaultAddress,
  RemoveProdToFav,
  VerifyPromoCode,
  GetFeaturedProducts,
  GetUserAddresses,
  VerifyUserAccount,
  FetchUserAddresses,
  GetActiveDeals,
  GetActivePromotionalBanners,
  AddDealToCart,
  DeleteDealFromCart,
  UpdateUserImage,
  UpdateUserDetailsWithImage,
  DeleteUser,
};
