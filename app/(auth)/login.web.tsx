import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import RightPanel from './RightPanel.web'; // <-- novo componente separado

const BLUE = '#2563EB';

// Breakpoint similar to Tailwind's lg
const useIsWide = () => {
  const { width } = useWindowDimensions();
  return width >= 1024;
};

export default function LoginScreenWeb() {
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
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      router.replace('/(tabs)');
    } catch {
      Alert.alert('No se pudo iniciar sesión', 'Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.screen}
    >
      {/* Two-column grid on wide screens, single column otherwise */}
      <View style={[styles.grid, isWide ? styles.gridWide : styles.gridNarrow]}>
        {/* Left: form with fixed max width */}
        <View style={styles.leftPane}>
          <View style={styles.formWrap}>
            <View>
              <ThemedText style={styles.h1}>Bienvenido</ThemedText>
              <ThemedText style={styles.muted}>
                ¿No tienes cuenta?{' '}
                <Link href="/(auth)/signup">
                  <ThemedText style={[styles.linkStrong, styles.link]}>
                    Regístrate
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
                <View style={styles.rowBetween}>
                  <ThemedText style={[styles.label, errors.password && styles.labelError]}>Contraseña</ThemedText>
                  <Link href="/(auth)/forgot">
                    <ThemedText type="link" style={[styles.link, styles.small]}>
                      ¿Has olvidado tu contraseña?
                    </ThemedText>
                  </Link>
                </View>
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
                  {submitting ? 'Ingresando…' : 'Iniciar sesión'}
                </ThemedText>
              </Pressable>
            </View>

            {/* Divider */}
            <View style={styles.altDivider}>
              <View style={styles.altLine} />
              <ThemedText style={styles.altText}>O continúa con</ThemedText>
              <View style={styles.altLine} />
            </View>

            {/* Social buttons split 50/50 */}
            <View style={styles.socialRow}>
              <Pressable style={({ pressed }) => [styles.oauthApple, pressed && styles.pressed]}>
                <Ionicons name="logo-apple" size={18} color="#111" style={{ marginRight: 8 }} />
                <ThemedText style={styles.oauthAppleText}>Continuar con Apple</ThemedText>
              </Pressable>
              <Pressable style={({ pressed }) => [styles.oauthGoogle, pressed && styles.pressed]}>
                <Ionicons name="logo-google" size={18} color="#111" style={{ marginRight: 8 }} />
                <ThemedText style={styles.oauthGoogleText}>Continuar con Google</ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Right: aside with image and copy, only on wide web */}
        {Platform.OS === "web" && isWide && (
          <RightPanel />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// Tokens similar to Tailwind primitives used in your Next.js page
const RADIUS = 8; // buttons slightly less rounded
const BORDER = '#e5e7eb';
const FG = '#111111';

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  grid: { flex: 1 },
  gridWide: { flexDirection: 'row' },
  gridNarrow: { flexDirection: 'column' },

  leftPane: {
    flexBasis: 0,
    flexGrow: 7, // ~35%
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formWrap: {
    width: '100%',
    maxWidth: 384, // ~ w-96
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 8,
  },

  rightPane: {
    flexBasis: 0,
    flexGrow: 13, // ~65%
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE, // Changed to BLUE
    alignSelf: 'stretch', // <-- ensure it stretches vertically
    height: '100%',        // <-- guarantee full height
    position: 'relative', // <-- required so pager absolute is positioned inside this pane
    overflow: 'hidden',   // <-- prevent slides/text from escaping the blue panel
  },
  asideWrap: {
    alignItems: 'center',
    textAlign: 'center',
    padding: 32,
    maxWidth: 560,
  },
  heroImage: {
    width: 500,
    height: 300,
    borderRadius: 16,
  },

  h1: { fontSize: 30, lineHeight: 36, letterSpacing: -0.3, fontWeight: '700', color: FG },
  muted: { marginTop: 6, color: '#6b7280', fontSize: 14 },
  link: { color: BLUE, opacity: 0.9 },
  linkStrong: { fontWeight: '600' },
  small: { fontSize: 14 },
  label: { fontWeight: '600', color: FG, fontSize: 14 },

  asideKicker: { fontSize: 14, opacity: 0.8, marginBottom: 6, textAlign: 'center' },
  asideTitle: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    textAlign: 'center',
    color: FG,
  },

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
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
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