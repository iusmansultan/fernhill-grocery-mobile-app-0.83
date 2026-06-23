import { apiClient } from '../client';
import type { ApiResponse } from '../types';

export async function fetchActiveDeals() {
  const { data } = await apiClient.get<ApiResponse<unknown[]>>('/deal/active');
  return data;
}
