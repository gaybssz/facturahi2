import { ThemedText } from '@/components/ThemedText';
import { signInWithEmail } from '@/lib/auth';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

// Expo Router requires a fallback (non-platform) route file.
// This wrapper picks the platform-specific implementation.
const Impl = Platform.OS === 'web'
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ? (require('./login.web').default as React.ComponentType)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  : (require('./login.native').default as React.ComponentType);

export default function LoginRoute(props: any) {
  const C = Impl as any;
  return <C {...props} />;
}

function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!email || !password) {
      setError('Preencha email e senha.');
      return;
    }
    try {
      setSubmitting(true);
      await signInWithEmail(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao autenticar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={styles.container}>
      <View style={styles.form}>
        <ThemedText type="title">Entrar</ThemedText>
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
        <ThemedText style={styles.label}>Email</ThemedText>
        <View style={styles.inputContainer}>
          <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        </View>

        <ThemedText style={[styles.label, { marginTop: 12 }]}>Senha</ThemedText>
        <View style={styles.inputContainer}>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        </View>

        <Pressable onPress={onSubmit} style={styles.primary} disabled={submitting}>
          <ThemedText style={styles.primaryText}>{submitting ? 'Entrando…' : 'Entrar'}</ThemedText>
        </Pressable>

        <View style={styles.linksRow}>
          <Link href="/(auth)/signup"><ThemedText>Criar conta</ThemedText></Link>
          <Link href="/(auth)/forgot"><ThemedText>Esqueci senha</ThemedText></Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  form: { maxWidth: 420, width: '100%', alignSelf: 'center', gap: 8 },
  label: { fontWeight: '600' },
  inputContainer: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, backgroundColor: '#fff' },
  input: { padding: 10 },
  primary: { backgroundColor: '#2563EB', borderRadius: 8, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  primaryText: { color: '#fff', fontWeight: '600' },
  linksRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  error: { color: '#ef4444' },
});

