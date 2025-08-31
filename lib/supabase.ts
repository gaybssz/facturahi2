import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// Preferências de leitura: process.env (build time) -> expoConfig.extra -> manifest.extra -> manifest2
const getRuntimeExtra = () => {
  const c = Constants as any;
  const sources = [
    c?.expoConfig?.extra,
    c?.manifest?.extra,
    c?.manifest2?.extra,
    c?.manifest?.extra?.extra,
  ];
  for (const s of sources) {
    if (s && Object.keys(s).length) return s;
  }
  return {};
};

const extras = getRuntimeExtra();

const SUPABASE_URL = process.env.SUPABASE_URL ?? extras?.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? extras?.SUPABASE_ANON_KEY ?? '';

// Não lançar na importação (evita erros durante SSR/compile).
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn('Supabase config not found at runtime. Values read:');
  // eslint-disable-next-line no-console
  console.warn('  process.env.SUPABASE_URL:', process.env.SUPABASE_URL);
  // eslint-disable-next-line no-console
  console.warn('  process.env.SUPABASE_ANON_KEY present?:', Boolean(process.env.SUPABASE_ANON_KEY));
  // eslint-disable-next-line no-console
  console.warn('  expo extras (sample keys):', Object.keys(extras).slice(0, 20));
  // eslint-disable-next-line no-console
  console.warn(
    'Set SUPABASE_URL and SUPABASE_ANON_KEY in app.json (expo.extra) or as environment variables and restart the dev server with cache cleared (expo start -c).'
  );
}

const secureStoreAdapter = {
  async getItem(key: string) {
    return await SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string) {
    await SecureStore.deleteItemAsync(key);
  },
};

// Criar cliente somente se as chaves existirem; caso contrário exportar um proxy que lança erro amigável ao usar.
let _supabase: SupabaseClient | any;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: secureStoreAdapter as any,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
} else {
  const missingMessage =
    'Supabase is not configured at runtime. Set SUPABASE_URL and SUPABASE_ANON_KEY in app.json under expo.extra or via environment variables.';

  _supabase = new Proxy(
    {},
    {
      get() {
        return () => {
          throw new Error(missingMessage);
        };
      },
      apply() {
        throw new Error(missingMessage);
      },
    }
  ) as SupabaseClient;
}

/**
 * Supabase client for the app.
 */
export const supabase: SupabaseClient = _supabase;

// Added: flag e getter seguros para evitar usar o cliente sem configuração
export const isSupabaseConfigured = Boolean(
  (process.env.SUPABASE_URL ?? (extras?.SUPABASE_URL)) &&
    (process.env.SUPABASE_ANON_KEY ?? (extras?.SUPABASE_ANON_KEY))
);

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured at runtime. Set SUPABASE_URL and SUPABASE_ANON_KEY in app.json (expo.extra) or as environment variables.'
    );
  }
  return supabase;
}