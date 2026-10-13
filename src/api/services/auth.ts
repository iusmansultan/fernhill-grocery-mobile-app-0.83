import { apiClient } from '../client';
import type { ApiResponse, User } from '../types';

export async function signIn(email: string, password: string) {
  const { data } = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
    '/auth/login',
    { email: email.toLowerCase(), password },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

export type SocialLoginPayload = {
  provider: 'apple' | 'google';
  providerId: string;
  email: string;
  name?: string | null;
  givenName?: string | null;
  familyName?: string | null;
  profileImage?: string | null;
};

export async function socialLogin(payload: SocialLoginPayload) {
  const { data } = await apiClient.post<ApiResponse<{ user: User; token: string }>>(
    '/auth/social-login',
    {
      ...payload,
      email: payload.email.toLowerCase().trim(),
    },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

export async function signUp(email: string, password: string) {
  const { data } = await apiClient.post('/auth/register', {
    email,
    password,
    phone: '+9232423',
    username: email.split('@')[0],
    stripe_id: null,
    image: '',
  });
  return data;
}

export async function verifyOtp(token: string, body: Record<string, unknown>) {
  const { data } = await apiClient.post('/auth/verify-otp', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function requestForgotPassword(email: string) {
  const { data } = await apiClient.post<ApiResponse<null>>(
    '/auth/forgot-password-request',
    { email: email.toLowerCase().trim() },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}

export async function resetForgotPassword(
  email: string,
  otp: string,
  newPassword: string
) {
  const { data } = await apiClient.post<ApiResponse<null>>(
    '/auth/forgot-password',
    {
      email: email.toLowerCase().trim(),
      otp: otp.trim(),
      newPassword,
    },
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
}
