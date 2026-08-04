import type { User } from '@/types';
import Cookies from 'js-cookie';

const ACCESS_TOKEN_KEY = 'minicrm.accessToken';
const REFRESH_TOKEN_KEY = 'minicrm.refreshToken';
const USER_KEY = 'minicrm.user';
const REMEMBER_KEY = 'minicrm.remember';

const ALL_KEYS = [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY, REMEMBER_KEY];

const BASE_OPTIONS: Cookies.CookieAttributes = {
  path: '/',
  // Tokenlar Authorization sarlavhasida yuboriladi, cookie sifatida emas —
  // shuning uchun 'strict' hech qanday so'rovni buzmaydi.
  sameSite: 'strict',
  secure: window.location.protocol === 'https:',
};

/**
 * JWT ichidagi `exp` — muddatni backend belgilaydi, frontend faqat unga
 * ergashadi. Shu sababli cookie tokendan uzoq yashay olmaydi.
 */
function readExpiry(token: string): Date | undefined {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return undefined;
    }

    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const { exp } = JSON.parse(json) as { exp?: number };

    return typeof exp === 'number' ? new Date(exp * 1000) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * "Eslab qolish" belgilanmagan bo'lsa `expires` berilmaydi va cookie sessiya
 * cookie bo'lib qoladi — brauzer yopilganda o'chadi. Belgilangan bo'lsa ham
 * cookie refresh tokenning o'z muddatidan oshmaydi.
 */
function optionsFor(remember: boolean, refreshToken?: string): Cookies.CookieAttributes {
  const expires = remember && refreshToken ? readExpiry(refreshToken) : undefined;

  return expires ? { ...BASE_OPTIONS, expires } : BASE_OPTIONS;
}

function isRemembered(): boolean {
  return Cookies.get(REMEMBER_KEY) === '1';
}

/** Mavjud sessiyaning cookie sozlamalari — `saveUser` ularni o'zgartirmasligi uchun. */
function currentOptions(): Cookies.CookieAttributes {
  return optionsFor(isRemembered(), Cookies.get(REFRESH_TOKEN_KEY));
}

// Ilova oldin tokenlarni localStorage'da saqlagan (dark mode ham o'sha yerda
// edi) — eski qiymatlar qolib ketmasligi uchun bir marta tozalaymiz.
[...ALL_KEYS, 'minicrm.colorMode'].forEach((key) => localStorage.removeItem(key));

export const tokenStorage = {
  getAccessToken: (): string | null => Cookies.get(ACCESS_TOKEN_KEY) ?? null,
  getRefreshToken: (): string | null => Cookies.get(REFRESH_TOKEN_KEY) ?? null,

  getUser: (): User | null => {
    const raw = Cookies.get(USER_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  /**
   * `remember` berilmasa oldingi tanlov saqlanadi — token yangilanganda
   * sessiya turi o'zgarib ketmasligi uchun.
   */
  save: (
    accessToken: string,
    refreshToken: string,
    user: User,
    remember: boolean = isRemembered(),
  ): void => {
    const options = optionsFor(remember, refreshToken);

    Cookies.set(REMEMBER_KEY, remember ? '1' : '0', options);
    Cookies.set(ACCESS_TOKEN_KEY, accessToken, options);
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, options);
    Cookies.set(USER_KEY, JSON.stringify(user), options);
  },

  saveUser: (user: User): void => {
    Cookies.set(USER_KEY, JSON.stringify(user), currentOptions());
  },

  clear: (): void => {
    ALL_KEYS.forEach((key) => Cookies.remove(key, { path: BASE_OPTIONS.path }));
  },
};
