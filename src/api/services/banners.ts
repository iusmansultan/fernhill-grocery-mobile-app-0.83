import { apiClient } from '../client';
import type { ApiResponse } from '../types';

export async function fetchActiveBanners(storeId?: string | number | null) {
  const query = storeId ? `?store_id=${storeId}` : '';
  const { data } = await apiClient.get<ApiResponse<unknown[]>>(
    `/promotional-banner/active${query}`
  );
  return data;
}
