import { Link, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import AuthScaffold from '@/components/AuthScaffold';

export default function LoginScreenNative() {
  const router = useRouter();
  const isIOS = Platform.OS === 'ios';

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
        <View style={styles.block}>
          <Pressable onPress={() => router.push('/(auth)/email-login')} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
            <ThemedText style={styles.primaryText}>Iniciar sesión</ThemedText>
          </Pressable>
        </View>

        <View style={styles.altDivider}>
          <View style={styles.altLine} />
          <ThemedText style={{ opacity: 0.6 }}>O continúa con</ThemedText>
          <View style={styles.altLine} />
        </View>

        <View style={styles.socialRow}>
          {isIOS && (
            <Pressable style={({ pressed }) => [styles.oauthAppleSmall, pressed && styles.pressed]}>
              <Ionicons name="logo-apple" size={18} color="#111" style={{ marginRight: 6 }} />
              <ThemedText style={styles.oauthAppleText}>Continuar con Apple</ThemedText>
            </Pressable>
          )}
          <Pressable style={({ pressed }) => [styles.oauthGoogleSmall, pressed && styles.pressed]}>
            <Ionicons name="logo-google" size={16} color="#fff" style={{ marginRight: 6 }} />
            <ThemedText style={styles.oauthGoogleText}>Continuar con Google</ThemedText>
          </Pressable>
          {!isIOS && <View style={{ flex: 1 }} />}
        </View>
      </AuthScaffold>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  block: { gap: 12 },
  primary: { backgroundColor: '#111', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '600' },
  pressed: { opacity: 0.85 },
  altDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, marginBottom: 8 },
  altLine: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.08)' },
  socialRow: { flexDirection: 'row', gap: 10 },
  oauthAppleSmall: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e3e3e3', borderRadius: 12, paddingVertical: 10 },
  oauthGoogleSmall: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', borderRadius: 12, paddingVertical: 10 },
  oauthAppleText: { color: '#111', fontWeight: '600' },
  oauthGoogleText: { color: '#fff', fontWeight: '600' },
});
