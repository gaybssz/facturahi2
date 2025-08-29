import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import AuthScaffold from '@/components/AuthScaffold';

export default function EmailLoginNative() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Falta información', 'Ingresa email y contraseña.');
      return;
    }
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
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <AuthScaffold
        title="Inicia sesión"
        subtitle={
          <>
            ¿No tienes cuenta? <Link href="/(auth)/signup"><ThemedText type="link">Regístrate</ThemedText></Link>
          </>
        }
        noCardOnMobile
        mobileAlign="end"
      >
        <View style={styles.formRow}>
          <ThemedText style={styles.label}>Email</ThemedText>
          <TextInput
            placeholder="m@example.com"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />

          <View style={styles.rowBetween}>
            <ThemedText style={styles.label}>Contraseña</ThemedText>
            <Pressable onPress={() => Alert.alert('Recuperar contraseña', 'Te enviaremos un enlace por email.')}>
              <ThemedText type="link">¿Olvidaste tu contraseña?</ThemedText>
            </Pressable>
          </View>
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <Pressable onPress={onSubmit} style={({ pressed }) => [styles.primary, pressed && styles.pressed]} disabled={submitting}>
            <ThemedText style={styles.primaryText}>{submitting ? 'Ingresando…' : 'Iniciar sesión'}</ThemedText>
          </Pressable>
        </View>
      </AuthScaffold>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formRow: { gap: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  primary: { backgroundColor: '#111', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '600' },
  pressed: { opacity: 0.85 },
});

