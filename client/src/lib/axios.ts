import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './token-storage';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

/** Sessiya tugaganda AuthProvider shu hodisani tinglab foydalanuvchini logout qiladi. */
export const SESSION_EXPIRED_EVENT = 'minicrm:session-expired';

interface RetriableRequest extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let refreshPromise: Promise<string> | null = null;

/** Bir vaqtda ketgan bir nechta 401 uchun bitta refresh so'rovi yuboriladi. */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token yo\'q');
  }

  const { data } = await axios.post('/api/auth/refresh', { refreshToken });
  tokenStorage.save(data.accessToken, data.refreshToken, data.user);

  return data.accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetriableRequest | undefined;
    const isAuthRoute = request?.url?.includes('/auth/');

    if (error.response?.status !== 401 || !request || request._retried || isAuthRoute) {
      return Promise.reject(error);
    }

    request._retried = true;

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });

      const accessToken = await refreshPromise;
      request.headers.Authorization = `Bearer ${accessToken}`;

      return api(request);
    } catch {
      tokenStorage.clear();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));

      return Promise.reject(error);
    }
  },
);

/** Backenddagi global error filter `{ message }` qaytaradi — shuni o'qiydi. */
export function getErrorMessage(error: unknown, fallback = 'Nimadir xato ketdi'): string {
  if (error instanceof AxiosError) {
    const message = (error.response?.data as { message?: string | string[] } | undefined)?.message;

    if (Array.isArray(message)) {
      return message[0] ?? fallback;
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  return fallback;
}
