import type { Session, User } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabase';

export async function signUpWithEmail(email: string, password: string) {
  const res = await supabase.auth.signUp({ email, password });
  if (res.error) throw res.error;
  return res.data;
}

export async function signInWithEmail(email: string, password: string) {
  const res = await supabase.auth.signInWithPassword({ email, password });
  if (res.error) throw res.error;
  return res.data;
}

export async function signInWithOtp(email: string) {
  const res = await supabase.auth.signInWithOtp({ email });
  if (res.error) throw res.error;
  return res.data;
}

export async function sendPasswordResetEmail(email: string, redirectTo?: string) {
  const res = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (res.error) throw res.error;
  return res.data;
}

export async function signOut() {
  await supabase.auth.signOut();
  // ensure token cleanup
  await SecureStore.deleteItemAsync('supabase.auth.token');
}

export async function getUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error) return null;
  return data.session ?? null;
}

export function onAuthStateChange(handler: (event: string, session: Session | null) => void) {
  const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
    handler(event, session ?? null);
  });
  return () => subscription?.unsubscribe();
}