import { apiClient, authHeaders } from '../client';

export interface StoreLookupResult {
  status: boolean;
  message: string;
  data?: unknown;
}

export async function fetchStoreByZip(
  zip: string,
  token: string
): Promise<StoreLookupResult> {
  try {
    const { data } = await apiClient.get<{ data: unknown[] }>(
      `/store?zipCode=${zip.toUpperCase()}`,
      { headers: authHeaders(token) }
    );

    if (data.data.length > 0) {
      return {
        status: true,
        message: 'success',
        data: data.data[0],
      };
    }

    return {
      status: false,
      message:
        'We are not in your area. We have noted, and we will be there soon.',
    };
  } catch {
    return {
      status: false,
      message:
        'We are not in your area. We have noted, and we will be there soon.',
    };
  }
}
