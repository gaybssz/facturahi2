import Constants from 'expo-constants';
import { getSession } from './auth';

const API_BASE =
  (Constants as any)?.expoConfig?.extra?.API_URL ??
  (Constants as any)?.manifest?.extra?.API_URL ??
  process.env.API_URL ??
  'https://example.com'; // ajuste em produção via expo config / env

type RequestOpts = {
  timeout?: number;
  headers?: Record<string, string>;
};

async function request<T = any>(
  path: string,
  method = 'GET',
  body?: any,
  opts: RequestOpts = {}
): Promise<T> {
  const timeout = opts.timeout ?? 10000;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const url = `${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

    // attach auth token if available (for calls to your own API backend)
    const session = await getSession();
    const token = session?.access_token;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(opts.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      const message = data && data.message ? data.message : `Request failed with status ${res.status}`;
      const err = new Error(String(message));
      (err as any).status = res.status;
      throw err;
    }

    return data as T;
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      const e = new Error('Request timeout');
      (e as any).name = 'AbortError';
      throw e;
    }
    throw err;
  } finally {
    clearTimeout(id);
  }
}

export async function getJSON<T = any>(path: string, opts?: RequestOpts): Promise<T> {
  return request<T>(path, 'GET', undefined, opts);
}

export async function postJSON<T = any>(path: string, body?: any, opts?: RequestOpts): Promise<T> {
  return request<T>(path, 'POST', body, opts);
}

export const API_BASE_URL = API_BASE;
