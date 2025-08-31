import { ThemedText } from '@/components/ThemedText';
import { signUpWithEmail } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import RightPanel from './RightPanel.web';

const BLUE = '#2563EB';

const useIsWide = () => {
  const { width } = useWindowDimensions();
  return width >= 1024;
};

export default function SignupScreenWeb() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const isWide = useIsWide();

  const onSubmit = async () => {
    const next: { email?: string; password?: string } = {};
    if (!email) next.email = 'Ingresa tu email.';
    if (!password) next.password = 'Ingresa tu contraseña.';
    setErrors(next);
    if (next.email || next.password) return;

    if (!isSupabaseConfigured) {
      setErrors({ email: 'Configuração do Supabase ausente. Contate o suporte.' });
      return;
    }

    try {
      setSubmitting(true);
      await signUpWithEmail(email.trim(), password);
      // Supabase pode exigir confirmação via email dependendo das configurações.
      router.replace('/(tabs)');
    } catch (err: any) {
      setErrors({ email: err?.message ?? 'Erro ao criar conta' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.screen}
    >
      <View style={[styles.grid, isWide ? styles.gridWide : styles.gridNarrow]}>
        <View style={styles.leftPane}>
          <View style={styles.formWrap}>
            <View>
              <ThemedText style={styles.h1}>Crea tu cuenta</ThemedText>
              <ThemedText style={styles.muted}>
                ¿Ya tienes cuenta?{' '}
                <Link href="/(auth)/login">
                  <ThemedText style={[styles.linkStrong, styles.link]}>
                    Inicia sesión
                  </ThemedText>
                </Link>
              </ThemedText>
            </View>

            <View style={{ marginTop: 24 }}>
              <View style={{ gap: 4, marginBottom: 14 }}>
                <ThemedText style={[styles.label, errors.email && styles.labelError]}>Email</ThemedText>
                <View style={[styles.inputContainer, focusEmail && styles.inputFocused, errors.email && styles.inputError]}>
                  <TextInput
                    placeholder="m@example.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    placeholderTextColor="#9ca3af"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusEmail(true)}
                    onBlur={() => setFocusEmail(false)}
                    style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' }]}
                  />
                </View>
                {errors.email ? (
                  <ThemedText style={styles.errorText}>{errors.email}</ThemedText>
                ) : null}
              </View>

              <View style={{ gap: 4, marginBottom: 14 }}>
                <ThemedText style={[styles.label, errors.password && styles.labelError]}>Contraseña</ThemedText>
                <View style={[styles.inputContainer, focusPassword && styles.inputFocused, errors.password && styles.inputError]}>
                  <TextInput
                    placeholder="Contraseña"
                    secureTextEntry
                    placeholderTextColor="#9ca3af"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusPassword(true)}
                    onBlur={() => setFocusPassword(false)}
                    style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' }]}
                  />
                </View>
                {errors.password ? (
                  <ThemedText style={styles.errorText}>{errors.password}</ThemedText>
                ) : null}
              </View>

              <Pressable
                onPress={onSubmit}
                style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
                disabled={submitting}
              >
                <ThemedText style={styles.primaryText}>
                  {submitting ? 'Creando…' : 'Crear cuenta'}
                </ThemedText>
              </Pressable>
            </View>

            <View style={styles.altDivider}>
              <View style={styles.altLine} />
              <ThemedText style={styles.altText}>O crea tu cuenta con</ThemedText>
              <View style={styles.altLine} />
            </View>

            <View style={styles.socialRow}>
              <Pressable style={({ pressed }) => [styles.oauthApple, pressed && styles.pressed]}>
                <Ionicons name="logo-apple" size={18} color="#111" style={{ marginRight: 8 }} />
                <ThemedText style={styles.oauthAppleText}>Continuar con Apple</ThemedText>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.oauthGoogle, pressed && styles.pressed]}>
                <Ionicons name="logo-google" size={18} color="#111" style={{ marginRight: 8 }} />
                <ThemedText style={styles.oauthGoogleText}>Continuar com Google</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        {Platform.OS === "web" && isWide && (
          <RightPanel />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const RADIUS = 8;
const BORDER = '#e5e7eb';
const FG = '#111111';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  grid: { flex: 1 },
  gridWide: { flexDirection: 'row' },
  gridNarrow: { flexDirection: 'column' },

  leftPane: {
    flexBasis: 0,
    flexGrow: 7,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formWrap: {
    width: '100%',
    maxWidth: 384,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 8,
  },

  h1: { fontSize: 30, lineHeight: 36, letterSpacing: -0.3, fontWeight: '700', color: FG },
  muted: { marginTop: 6, color: '#6b7280', fontSize: 14 },
  link: { color: BLUE, opacity: 0.9 },
  linkStrong: { fontWeight: '600' },
  label: { fontWeight: '600', color: FG, fontSize: 14 },

  inputContainer: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  inputFocused: { borderColor: BLUE },
  inputError: { borderColor: '#ef4444' },
  labelError: { color: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 2 },
  primary: {
    backgroundColor: BLUE,
    borderRadius: RADIUS,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  pressed: { opacity: 0.85 },
  altDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 24, marginBottom: 10 },
  altText: { opacity: 0.6, fontSize: 14 },
  altLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
  socialRow: { flexDirection: 'row', gap: 10 },
  oauthApple: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER, borderRadius: RADIUS, paddingVertical: 8 },
  oauthGoogle: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: BORDER, borderRadius: RADIUS, paddingVertical: 8 },
  oauthAppleText: { color: '#111', fontWeight: '600', fontSize: 14 },
  oauthGoogleText: { color: '#111', fontWeight: '600', fontSize: 14 },
});
