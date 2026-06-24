import { apiClient } from '../client';
import type { ApiResponse } from '../types';

export async function saveDeviceToken(userId: number | string, token: string) {
  const { data } = await apiClient.post<ApiResponse<unknown>>('/token', {
    userId: String(userId),
    token,
  });
  return data;
}
