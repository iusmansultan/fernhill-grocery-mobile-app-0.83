import { apiClient } from '../client';
import type { ApiResponse, CheckoutSummary, Order } from '../types';

export async function checkoutCart(data: Record<string, unknown>) {
  const { data: response } = await apiClient.post<ApiResponse<CheckoutSummary>>(
    '/order/checkout',
    data
  );
  return response.data;
}

export async function createOrder(data: Record<string, unknown>) {
  const { data: response } = await apiClient.post<ApiResponse<Order>>(
    '/order/createOrder',
    data
  );
  return response;
}

export async function fetchOrders(userId: string | number) {
  const { data } = await apiClient.get<ApiResponse<Order[]>>(
    `/order/getOrders/${userId}`
  );
  return data.data;
}
