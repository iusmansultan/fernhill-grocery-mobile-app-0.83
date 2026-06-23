import axios, { AxiosError } from 'axios';
import { baseUrl } from '../helpers/Config';

export const apiClient = axios.create({ baseURL: baseUrl });

apiClient.interceptors.request.use(
  (config) => {
    try {
      const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
      console.log('[API Request]', (config.method || 'GET').toUpperCase(), fullUrl, {
        headers: config.headers,
        params: config.params,
        data: config.data,
      });
    } catch {
      // ignore logging errors
    }
    return config;
  },
  (error: AxiosError) => {
    try {
      const cfg = error?.config;
      const fullUrl = `${cfg?.baseURL || ''}${cfg?.url || ''}`;
      console.log('[API Request Error]', error?.message, fullUrl);
    } catch {
      // ignore logging errors
    }
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    try {
      const fullUrl = `${response?.config?.baseURL || ''}${response?.config?.url || ''}`;
      console.log('[API Response]', response.status, fullUrl, response?.data);
    } catch {
      // ignore logging errors
    }
    return response;
  },
  (error: AxiosError) => {
    try {
      if (error?.response) {
        const { status, config, data } = error.response;
        const fullUrl = `${config?.baseURL || ''}${config?.url || ''}`;
        console.log('[API Response Error]', status, fullUrl, data);
      } else {
        const cfg = error?.config;
        const fullUrl = `${cfg?.baseURL || ''}${cfg?.url || ''}`;
        console.log('[API Response Error]', error?.message, fullUrl);
      }
    } catch {
      // ignore logging errors
    }
    return Promise.reject(error);
  }
);

export function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
}
