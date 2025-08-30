import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import AuthScaffold from '@/components/AuthScaffold';

export default function ForgotPasswordNative() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email) {
      Alert.alert('Falta información', 'Ingresa tu email.');
      return;
    }
    try {
      setSubmitting(true);
      await new Promise((r) => setTimeout(r, 600));
      Alert.alert('Listo', 'Te enviamos un enlace para restablecer tu contraseña.');
      router.back();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <AuthScaffold
        title="Recuperar contraseña"
        subtitle={
          <ThemedText style={{ opacity: 0.7 }}>
            Ingresa tu email y te enviaremos un enlace.
          </ThemedText>
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

          <Pressable onPress={onSubmit} style={({ pressed }) => [styles.primary, pressed && styles.pressed]} disabled={submitting}>
            <ThemedText style={styles.primaryText}>{submitting ? 'Enviando…' : 'Enviar enlace'}</ThemedText>
          </Pressable>

          <View style={{ alignItems: 'center' }}>
            <Link href="/(auth)/login"><ThemedText type="link">Volver al inicio de sesión</ThemedText></Link>
          </View>
        </View>
      </AuthScaffold>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  formRow: { gap: 12 },
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

