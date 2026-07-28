import * as SecureStore from 'expo-secure-store';

// Same backend as the web app (src/services/api.js). Move this to an env
// var (EXPO_PUBLIC_API_BASE_URL) before shipping so you're not hardcoding it.
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://e-commerce-zvmh.onrender.com/api/v1';

const ACCESS_TOKEN_KEY = 'hr_access_token';
const REFRESH_TOKEN_KEY = 'hr_refresh_token';

let accessToken: string | null = null;

export async function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function getAccessToken() {
  if (accessToken) return accessToken;
  accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  return accessToken;
}

export async function setRefreshToken(token: string | null) {
  if (token) await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function getRefreshToken() {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(status: number, data: any) {
    super(data?.message || `Request failed (${status})`);
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  isForm?: boolean;
  skipAuth?: boolean;
  _retry?: boolean;
};

// NOTE (backend change needed): the web app relies on an httpOnly refresh
// cookie via POST /auth/refresh. Cookies don't persist reliably across app
// restarts in React Native. Ask the backend to also return refreshToken in
// the JSON body on login/register/firebase endpoints (in addition to the
// cookie) so this client can store it in SecureStore and send it explicitly
// on refresh, e.g. POST /auth/refresh { refreshToken }.
async function request(path: string, options: RequestOptions = {}): Promise<any> {
  const token = options.skipAuth ? null : await getAccessToken();

  const headers: Record<string, string> = options.isForm
    ? {}
    : { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body
      ? options.isForm
        ? options.body
        : JSON.stringify(options.body)
      : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && !options._retry && !path.includes('/auth/') && !options.skipAuth) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      return request(path, { ...options, _retry: true });
    }
  }

  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

async function tryRefresh(): Promise<boolean> {
  try {
    const refreshToken = await getRefreshToken();
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error('refresh failed');
    const data = await res.json();
    await setAccessToken(data.data.accessToken);
    if (data.data.refreshToken) await setRefreshToken(data.data.refreshToken);
    return true;
  } catch {
    await setAccessToken(null);
    await setRefreshToken(null);
    return false;
  }
}

export const api = {
  get: (path: string) => request(path, { method: 'GET' }),
  post: (path: string, body?: any, opts: Partial<RequestOptions> = {}) =>
    request(path, { method: 'POST', body, ...opts }),
  put: (path: string, body?: any) => request(path, { method: 'PUT', body }),
  patch: (path: string, body?: any) => request(path, { method: 'PATCH', body }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
};
