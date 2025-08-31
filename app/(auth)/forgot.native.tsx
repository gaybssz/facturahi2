import { sendPasswordResetEmail } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import AuthScaffold from '@/components/AuthScaffold';
import { ThemedText } from '@/components/ThemedText';

// Nota: usamos Supabase auth via lib/auth.ts

const BLUE = '#2563EB';

export default function ForgotPasswordNative() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);

  const onSubmit = async () => {
    const emailTrim = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrim) {
      Alert.alert('Erro', 'Por favor insira seu email.');
      return;
    }
    if (!emailRegex.test(emailTrim)) {
      Alert.alert('Erro', 'Por favor insira um email válido.');
      return;
    }

    if (!isSupabaseConfigured) {
      Alert.alert('Erro', 'Configuração do Supabase ausente. Contate o suporte.');
      return;
    }

    try {
      setSubmitting(true);
      await sendPasswordResetEmail(emailTrim);
      Alert.alert('Sucesso', 'Verifique seu email para instruções de recuperação (verifique a caixa de spam).');
      router.back();
    } catch (error: any) {
      const message =
        error?.name === 'AbortError' ? 'Requisição expirada. Tente novamente.' : error?.message || 'Não foi possível enviar a solicitação.';
      Alert.alert('Erro', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <AuthScaffold noCardOnMobile mobileAlign="start" title={null as any}>
        <View style={styles.form}>
          {/* Top bar with back and logo space */}
          <View style={styles.topBar}>
            <Pressable onPress={() => router.push('/(auth)/login')} hitSlop={8} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={26} color="#111" />
            </Pressable>
            <View style={styles.logoSpace} />
          </View>

          {/* Title */}
          <View style={{ alignItems: 'center', marginTop: 24 }}>
            <ThemedText style={styles.h1Small}>Recuperar senha</ThemedText>
            <ThemedText style={styles.subtitle}>
              Informe o email cadastrado para receber instruções.
            </ThemedText>
          </View>

          <View style={{ marginTop: 20 }}>
            <ThemedText style={styles.label}>Email</ThemedText>
            <View style={[styles.inputRow, focusEmail && styles.inputRowFocused]}>
              <TextInput
                placeholder="seu@email.com"
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

          <TouchableOpacity
            onPress={onSubmit}
            style={[styles.button, submitting && styles.buttonDisabled]}
            disabled={submitting}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enviar</Text>}
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <View style={styles.loginInline}>
            <ThemedText style={{ opacity: 0.7 }}>¿Recuerdas tu contraseña? </ThemedText>
            <Link href="/(auth)/login" replace><ThemedText style={{ color: BLUE, fontWeight: '700' }}>Iniciar sesión</ThemedText></Link>
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
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: { backgroundColor: BLUE, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#fff', fontWeight: '600' },
  loginInline: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 },
});