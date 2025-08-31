import type { Session, User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { isSupabaseConfigured, supabase } from './supabase';

function ensureSupabase() {
  if (!isSupabaseConfigured) {
    const msg = 'Supabase não está configurado em tempo de execução. Verifique app.json (expo.extra) ou variáveis de ambiente.';
    // também logamos para o terminal do dev server
    // eslint-disable-next-line no-console
    console.error('[auth] ' + msg);
    throw new Error(msg);
  }
}

export async function signUpWithEmail(email: string, password: string) {
  ensureSupabase();
  const res = await supabase.auth.signUp({ email, password });
  if (res.error) throw res.error;
  return res.data;
}

export async function signInWithEmail(email: string, password: string) {
  ensureSupabase();
  const res = await supabase.auth.signInWithPassword({ email, password });
  if (res.error) throw res.error;
  return res.data;
}

export async function signInWithOtp(email: string) {
  ensureSupabase();
  const res = await supabase.auth.signInWithOtp({ email });
  if (res.error) throw res.error;
  return res.data;
}

export async function sendPasswordResetEmail(email: string, redirectTo?: string) {
  ensureSupabase();
  const res = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (res.error) throw res.error;
  return res.data;
}

export async function signOut() {
  ensureSupabase();
  await supabase.auth.signOut();
  // ensure token cleanup
  await SecureStore.deleteItemAsync('supabase.auth.token');
}

export async function getUser(): Promise<User | null> {
  ensureSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

export async function getSession(): Promise<Session | null> {
  ensureSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session ?? null;
}

export function onAuthStateChange(handler: (event: string, session: Session | null) => void) {
  const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
    handler(event, session ?? null);
  });
  return () => {
    // Compatibilidade com diferentes versões/formatos do cliente
    try {
      // caso subscription seja o objeto com método unsubscribe
      if (typeof (subscription as any)?.unsubscribe === 'function') {
        (subscription as any).unsubscribe();
        return;
      }
      // caso subscription seja { subscription: { unsubscribe: fn } }
      if (typeof (subscription as any)?.subscription?.unsubscribe === 'function') {
        (subscription as any).subscription.unsubscribe();
        return;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[auth] falha ao desinscrever onAuthStateChange:', e);
    }
  };
}