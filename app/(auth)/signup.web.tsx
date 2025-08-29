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
import VerifactuAnimation from '@/components/VerifactuAnimation.web';
import { ThemedText } from '@/components/ThemedText';

// Breakpoint similar to Tailwind's lg
const useIsWide = () => {
  const { width } = useWindowDimensions();
  return width >= 1024;
};

export default function SignupScreenWeb() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isWide = useIsWide();

  const onSubmit = async () => {
    if (!name || !email || !password || !confirm) {
      Alert.alert('Faltan datos', 'Completa todos los campos.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Las contraseñas no coinciden');
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      router.replace('/(tabs)');
    } catch {
      Alert.alert('No se pudo registrar', 'Inténtalo de nuevo.');
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
              <View style={{ gap: 6, marginBottom: 14 }}>
                <ThemedText style={styles.label}>Nombre completo</ThemedText>
                <TextInput
                  placeholder="John Doe"
                  autoCapitalize="words"
                  placeholderTextColor="#9ca3af"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                />
              </View>

              <View style={{ gap: 6, marginBottom: 14 }}>
                <ThemedText style={styles.label}>Email</ThemedText>
                <TextInput
                  placeholder="m@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholderTextColor="#9ca3af"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                />
              </View>

              <View style={{ gap: 6, marginBottom: 14 }}>
                <ThemedText style={styles.label}>Contraseña</ThemedText>
                <TextInput
                  placeholder="Contraseña"
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                />
              </View>

              <View style={{ gap: 6, marginBottom: 14 }}>
                <ThemedText style={styles.label}>Confirmar contraseña</ThemedText>
                <TextInput
                  placeholder="Confirmar contraseña"
                  secureTextEntry
                  placeholderTextColor="#9ca3af"
                  value={confirm}
                  onChangeText={setConfirm}
                  style={styles.input}
                />
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
          </View>
        </View>

        {Platform.OS === 'web' && isWide && (
          <View style={styles.rightPane}>
            <View style={styles.asideWrap}>
              <VerifactuAnimation />
              <ThemedText style={styles.asideKicker}>
                Regístrate gratis en segundos
              </ThemedText>
              <ThemedText style={styles.asideTitle}>
                Empieza a facturar con Facturahi
              </ThemedText>
            </View>
          </View>
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

  rightPane: {
    flexBasis: 0,
    flexGrow: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  asideWrap: {
    alignItems: 'center',
    textAlign: 'center',
    padding: 32,
    maxWidth: 560,
  },
  asideKicker: { fontSize: 14, opacity: 0.8, marginBottom: 6, textAlign: 'center' },
  asideTitle: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    textAlign: 'center',
    color: FG,
  },

  h1: { fontSize: 30, lineHeight: 36, letterSpacing: -0.3, fontWeight: '700', color: FG },
  muted: { marginTop: 6, color: '#6b7280', fontSize: 14 },
  link: { color: '#111', opacity: 0.9 },
  linkStrong: { fontWeight: '600' },
  label: { fontWeight: '600', color: FG, fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primary: {
    backgroundColor: '#111',
    borderRadius: RADIUS,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  pressed: { opacity: 0.85 },
});

