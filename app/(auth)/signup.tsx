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
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import AuthScaffold from '@/components/AuthScaffold';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      await new Promise((r) => setTimeout(r, 700));
      router.replace('/(tabs)');
    } catch {
      Alert.alert('No se pudo registrar', 'Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <AuthScaffold
        title="Crea tu cuenta"
        subtitle={
          <>
            ¿Ya tienes cuenta?{' '}
            <Link href="/(auth)/login"><ThemedText type="link">Inicia sesión</ThemedText></Link>
          </>
        }
        aside={
          <View style={{ maxWidth: 520 }}>
            <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>Regístrate gratis en segundos</ThemedText>
            <ThemedText type="title" style={{ textAlign: 'center', marginTop: 8 }}>
              Empieza a facturar con Facturahi
            </ThemedText>
          </View>
        }
      >
        <View style={styles.form}>
          <TextInput
            placeholder="Nombre completo"
            autoCapitalize="words"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
          <TextInput
            placeholder="Contraseña"
            secureTextEntry
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TextInput
            placeholder="Confirmar contraseña"
            secureTextEntry
            placeholderTextColor="#999"
            value={confirm}
            onChangeText={setConfirm}
            style={styles.input}
          />

          <Pressable onPress={onSubmit} style={({ pressed }) => [styles.primary, pressed && styles.buttonPressed]} disabled={submitting}>
            <ThemedText style={styles.primaryText}>{submitting ? 'Creando…' : 'Crear cuenta'}</ThemedText>
          </Pressable>
        </View>
      </AuthScaffold>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: { gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  primary: { marginTop: 6, backgroundColor: '#111', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  buttonPressed: { opacity: 0.9 },
  primaryText: { color: '#fff', fontWeight: '600' },
});
