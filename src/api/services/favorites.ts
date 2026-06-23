import { apiClient, authHeaders } from '../client';
import type { ApiResponse, Product } from '../types';

export async function fetchFavorites(token: string, userId: string | number) {
  const { data } = await apiClient.get<ApiResponse<Product[]>>(
    `/favorite/get/${userId}`,
    { headers: authHeaders(token) }
  );
  return data.data;
}

export async function addFavorite(
  token: string,
  body: Record<string, unknown>
) {
  const { data } = await apiClient.post('/favorite/create', body, {
    headers: authHeaders(token),
  });
  return data;
}

export async function removeFavorite(
  token: string,
  body: Record<string, unknown>
) {
  const { data } = await apiClient.delete('/favourite_products', {
    headers: authHeaders(token),
    data: body,
  });
  return data;
}
