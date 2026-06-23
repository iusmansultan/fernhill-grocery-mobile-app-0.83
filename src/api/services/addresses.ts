import { apiClient, authHeaders } from '../client';
import type { AddAddressBody, Address, ApiResponse } from '../types';

export async function fetchAddresses(userId: string | number) {
  const { data } = await apiClient.get<ApiResponse<Address[]>>(
    `/address/get/${userId}`
  );
  return data;
}

export async function addAddress(token: string, body: AddAddressBody) {
  const { data } = await apiClient.post<ApiResponse<Address[]>>('/address/add', body, {
    headers: authHeaders(token),
  });
  return data;
}

export async function removeAddress(token: string, addressId: string | number) {
  await apiClient.delete(`/address/addresses/${addressId}`, {
    headers: authHeaders(token),
  });
}

export async function setDefaultAddress(
  token: string,
  userId: string | number,
  addressId: string | number
) {
  const { data } = await apiClient.put<ApiResponse<Address[]>>(
    `/address/addresses/${addressId}/default`,
    { userId },
    { headers: authHeaders(token) }
  );
  return data;
}
