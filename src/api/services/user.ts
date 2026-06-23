import { apiClient, authHeaders } from '../client';
import type { ApiResponse } from '../types';

export async function createUser(body: Record<string, unknown>) {
  const { data } = await apiClient.post('/addUser', body);
  return data;
}

export async function updateUserInfo(
  token: string,
  body: Record<string, unknown>
) {
  const { data } = await apiClient.put<ApiResponse<unknown>>('/updateUser', body, {
    headers: authHeaders(token),
  });
  return data;
}

export async function updateUserImage(
  token: string,
  imageAsset: { uri: string; type?: string; fileName?: string },
  userId: string | number
) {
  const formData = new FormData();
  formData.append('image', {
    uri: imageAsset.uri,
    type: imageAsset.type || 'image/jpeg',
    name: imageAsset.fileName || `profile_${userId}.jpg`,
  } as unknown as Blob);

  const { data } = await apiClient.post<ApiResponse<unknown>>(
    `/user/upload/${userId}`,
    formData,
    {
      headers: {
        ...authHeaders(token),
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
}

export async function updateUserDetailsWithImage(
  token: string,
  details: Record<string, unknown>
) {
  const { data } = await apiClient.post<ApiResponse<unknown>>(
    '/user/updateUserDetails',
    details,
    { headers: authHeaders(token) }
  );
  return data;
}

export async function deleteUser(token: string, userId: string | number) {
  await apiClient.delete(`/user/deleteUser/${userId}`, {
    headers: authHeaders(token),
  });
  return { status: true, message: 'User deleted successfully' };
}
