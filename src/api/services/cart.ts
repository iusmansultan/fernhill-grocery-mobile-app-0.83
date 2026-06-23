import { apiClient, authHeaders } from '../client';
import type { ApiResponse, CartItem } from '../types';

export async function fetchUserCart(token: string, userId: string | number) {
  const { data } = await apiClient.get<ApiResponse<CartItem[]>>(
    `/user/getUserCart/${userId}`,
    { headers: authHeaders(token) }
  );
  return data.data;
}

export async function addProductToCart(
  token: string,
  body: Record<string, unknown>
) {
  const { data } = await apiClient.post<ApiResponse<unknown>>('/user/addToCart', body, {
    headers: authHeaders(token),
  });
  return data;
}

export async function addDealToCart(
  token: string,
  body: Record<string, unknown>
) {
  const { data } = await apiClient.post<ApiResponse<unknown>>(
    '/user/addDealToCart',
    body,
    { headers: authHeaders(token) }
  );
  return data;
}

export async function deleteProductFromCart(
  token: string,
  productId: string | number,
  userId: string | number
) {
  await apiClient.post(
    '/user/cart/delete',
    { userId, productId },
    { headers: authHeaders(token) }
  );
  return fetchUserCart(token, userId);
}

export async function deleteDealFromCart(
  token: string,
  dealId: string | number,
  userId: string | number
) {
  await apiClient.post(
    '/user/cart/deal/delete',
    { userId, dealId },
    { headers: authHeaders(token) }
  );
  return fetchUserCart(token, userId);
}
