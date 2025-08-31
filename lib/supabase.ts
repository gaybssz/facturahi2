import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// Preferências de leitura: process.env (build time) -> expoConfig.extra -> manifest.extra
const getRuntimeExtra = () =>
  (Constants as any)?.expoConfig?.extra ??
  (Constants as any)?.manifest?.extra ??
  {};

const extras = getRuntimeExtra();

const SUPABASE_URL = process.env.SUPABASE_URL ?? extras.SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? extras.SUPABASE_ANON_KEY ?? '';

// Não lançar no momento da importação (evita erros durante SSR/compile). Apenas warn.
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    'SUPABASE_URL and SUPABASE_ANON_KEY not found at runtime. Set them in app.json (expo.extra) or as environment variables.\n' +
      'If you are using expo-router/SSR, make sure keys are available at runtime or provide env variables during the build.'
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