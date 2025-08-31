import { ThemedText } from '@/components/ThemedText';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    TextInput,
    View,
    useWindowDimensions
} from 'react-native';
import RightPanel from './RightPanel.web'; // <-- reuse RightPanel component

const BLUE = '#2563EB';

const useIsWide = () => {
  const { width } = useWindowDimensions();
  return width >= 1024;
};

export default function ForgotScreenWeb() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [focusEmail, setFocusEmail] = useState(false);
  const isWide = useIsWide();

  const onSubmit = async () => {
    if (!email) {
      setError('Ingresa tu email.');
      return;
    }
    setError(undefined);
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      router.replace('/(auth)/login');
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
          <View style={[styles.formWrap, styles.formWrapLeft]}>
            <View>
              <ThemedText style={styles.h1}>¿Has olvidado tu contraseña?</ThemedText>
              <ThemedText style={styles.desc}>
                No te preocupes. Introduce tu email y te enviaremos un enlace para restablecerla.
              </ThemedText>
            </View>

            <View style={{ marginTop: 24 }}>
              <View style={{ gap: 4, marginBottom: 14 }}>
                <ThemedText style={[styles.label, error && styles.labelError]}>Email</ThemedText>
                <View style={[styles.inputContainer, focusEmail && styles.inputFocused, error && styles.inputError]}>
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
                {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
              </View>

              <Pressable
                onPress={onSubmit}
                style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
                disabled={submitting}
              >
                <ThemedText style={styles.primaryText}>
                  {submitting ? 'Enviando…' : 'Enviar enlace de reinicio'}
                </ThemedText>
              </Pressable>

              <View style={styles.footerRow}>
                <ThemedText style={styles.footerMuted}>¿Recuerdas tu contraseña? </ThemedText>
                <Link href="/(auth)/login">
                  <ThemedText style={[styles.linkStrong, styles.link]}>Iniciar sesión</ThemedText>
                </Link>
              </View>
            </View>
          </View>
        </View>

        {Platform.OS === 'web' && isWide && <RightPanel />}
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
  leftPane: { flexBasis: 0, flexGrow: 7, justifyContent: 'center', paddingHorizontal: 24 },
  rightPane: { flexBasis: 0, flexGrow: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: BLUE },
  formWrap: {
    width: '100%',
    gap: 8,
  },
  formWrapLeft: { maxWidth: 384, marginLeft: 'auto', marginRight: 'auto' },
  label: { fontWeight: '600', color: FG, fontSize: 14 },
  asideWrap: { alignItems: 'center', textAlign: 'center', padding: 32, maxWidth: 560 },
  heroImage: { width: 500, height: 300, borderRadius: 16 },
  h1: { fontSize: 30, lineHeight: 36, letterSpacing: -0.3, fontWeight: '700', color: FG },
  desc: { marginTop: 6, color: '#6b7280', fontSize: 14 },
  link: { color: BLUE, opacity: 0.9 },
  linkStrong: { fontWeight: '600' },
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
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  footerMuted: { color: '#6b7280', fontSize: 14, marginRight: 4 },
});
