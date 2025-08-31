import { Link, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import AuthScaffold from '@/components/AuthScaffold';

const BLUE = '#2563EB';

export default function LoginScreenNative() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const valid = useMemo(() => email.includes('@') && password.length >= 6, [email, password]);

  const onSubmit = async () => {
    if (!valid) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      router.replace('/(tabs)');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <AuthScaffold noCardOnMobile mobileAlign="start" title={null as any}>
        <View style={styles.form}>
          {/* Top bar: back + logo space */}
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={26} color="#111" />
            </Pressable>
            <View style={styles.logoSpace} />
          </View>

          {/* Title */}
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <ThemedText style={styles.h1Small}>Bienvenido de nuevo</ThemedText>
            <ThemedText style={styles.subtitle}>
              Accede a tu cuenta para empezar a emitir tus facturas
            </ThemedText>
          </View>

          <View style={{ marginTop: 20 }}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View style={[styles.inputRow, focusEmail && styles.inputRowFocused]}>
              <TextInput
                placeholder="Ingresa tu email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusEmail(true)}
                onBlur={() => setFocusEmail(false)}
                style={styles.input}
              />
            </View>
          </View>

          <View>
            <ThemedText style={styles.label}>Contraseña</ThemedText>
            <View style={[styles.inputRow, focusPassword && styles.inputRowFocused]}>
              <TextInput
                placeholder="Escribe tu contraseña"
                secureTextEntry={!showPassword}
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusPassword(true)}
                onBlur={() => setFocusPassword(false)}
                style={[styles.input, { paddingRight: 44 }]}
              />
              <Pressable onPress={() => setShowPassword((v) => !v)} style={styles.eyeBtn}>
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#6b7280" />
              </Pressable>
            </View>
            <Pressable onPress={() => router.push('/(auth)/forgot')} style={{ marginTop: 8, alignItems: 'flex-start' }}>
              <ThemedText style={{ color: BLUE, fontWeight: '700', fontSize: 14 }}>Olvidé mi contraseña</ThemedText>
            </Pressable>
          </View>

          <Pressable
            onPress={onSubmit}
            style={({ pressed }) => [styles.primary, (!valid || submitting) && styles.primaryDisabled, pressed && valid && styles.buttonPressed]}
            disabled={!valid || submitting}
          >
            <ThemedText style={styles.primaryText}>{submitting ? 'Entrando…' : 'Continuar'}</ThemedText>
          </Pressable>

          <View style={{ flex: 1 }} />

          <View style={styles.altDivider}>
            <View style={styles.altLine} />
            <ThemedText style={{ opacity: 0.6 }}>o entra con</ThemedText>
            <View style={styles.altLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable style={({ pressed }) => [styles.socialCircle, pressed && styles.buttonPressed]}>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
            </Pressable>
            <Pressable style={({ pressed }) => [styles.socialCircle, pressed && styles.buttonPressed]}>
              <Ionicons name="logo-apple" size={20} color="#111" />
            </Pressable>
          </View>

          <View style={styles.signupInline}>
            <ThemedText style={{ opacity: 0.7 }}>¿No tienes cuenta? </ThemedText>
            <Link href="/(auth)/signup" replace><ThemedText style={{ color: BLUE, fontWeight: '700' }}>Crear cuenta</ThemedText></Link>
          </View>
        </View>
      </AuthScaffold>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: { flex: 1, gap: 16 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  backBtn: { paddingVertical: 6, paddingRight: 8, paddingLeft: 0 },
  logoSpace: { width: 28, height: 28, borderRadius: 14, marginLeft: 6, backgroundColor: 'transparent' },
  h1Small: { fontSize: 24, lineHeight: 28, fontWeight: '700' },
  subtitle: { opacity: 0.7, marginTop: 8, textAlign: 'center', paddingHorizontal: 12 },
  label: { fontWeight: '700', marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  inputRowFocused: { borderColor: BLUE },
  input: { flex: 1, paddingHorizontal: 14, paddingVertical: 14, fontSize: 16 },
  eyeBtn: { position: 'absolute', right: 12, height: '100%', justifyContent: 'center', alignItems: 'center' },
  primary: { marginTop: 8, backgroundColor: BLUE, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryDisabled: { backgroundColor: '#d1d5db' },
  buttonPressed: { opacity: 0.9 },
  primaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  altDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, marginBottom: 8 },
  altLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.12)' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 8 },
  socialCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupInline: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
});
