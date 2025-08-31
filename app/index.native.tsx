import { Link, useRouter } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, View, useWindowDimensions, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { StatusBar } from 'expo-status-bar';

// Mobile-only onboarding inspired layout
export default function MobileOnboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const dynamicRadius = Math.round(width * 0.24); // slightly more rounded (~24% width)
  const [page, setPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const slides = [
    {
      title: 'Todas tus facturas en un solo lugar',
      desc: 'Controla tus ventas y simplifica tu facturación sin complicaciones.',
    },
    {
      title: 'Envia y cobra más rápido',
      desc: 'Comparte enlaces de pago y recibe confirmaciones al instante.',
    },
    {
      title: 'Organiza tus clientes',
      desc: 'Mantén historiales y datos siempre a mano y seguros.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (page + 1) % slides.length;
      scrollViewRef.current?.scrollTo({ x: nextPage * width, animated: true });
    }, 10000);
    return () => clearInterval(interval);
  }, [page, width, slides.length]);

  return (
    <KeyboardAvoidingView behavior={Platform.select({ ios: 'padding', android: undefined })} style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <SafeAreaView style={styles.root}>
          <StatusBar style="light" backgroundColor="#2563EB" />
          {/* Paint the top safe-area to blue (slightly transparent) */}
          <View style={{ height: insets.top, backgroundColor: 'rgba(37,99,235,0.8)', position: 'absolute', top: 0, left: 0, right: 0 }} />
          {/* Hero area (blue background) */}
          <View style={[
            styles.hero,
            { borderBottomLeftRadius: dynamicRadius, borderBottomRightRadius: dynamicRadius },
          ]}>
            {/* Empty: add image or carousel later */}
          </View>

          {/* Headline slider */}
          <View style={{ marginTop: 96 }}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / width);
                setPage(idx);
              }}
            >
              {slides.map((s, i) => (
                <View key={i} style={{ width, paddingHorizontal: 24 }}>
                  <ThemedText style={styles.h1}>{s.title}</ThemedText>
                  <ThemedText style={styles.muted}>{s.desc}</ThemedText>
                </View>
              ))}
            </ScrollView>
            <View style={styles.pagerRow}>
              {slides.map((_, i) => (
                <View key={i} style={[styles.pill, i === page ? styles.pillActive : styles.pillInactive]} />
              ))}
            </View>
          </View>

          {/* Bottom fixed CTAs */}
          <View style={[styles.bottomCtas, { paddingBottom: Math.max(28, insets.bottom + 20) }]}>
            <Pressable onPress={() => router.push('/(auth)/signup')} style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed] }>
              <ThemedText style={styles.primaryText}>Crear cuenta</ThemedText>
            </Pressable>
            <View style={styles.loginInline}>
              <ThemedText style={styles.loginMuted}>¿Ya tienes cuenta? </ThemedText>
              <Link href="/(auth)/login"><ThemedText style={styles.loginLink}>Iniciar sesión</ThemedText></Link>
            </View>
          </View>
        </SafeAreaView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const BLUE = '#2563EB';

const styles = StyleSheet.create({
  root: { flex: 1, position: 'relative' },
  hero: {
    backgroundColor: 'rgba(37,99,235,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    height: '45%',
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
  },
  illustrationPlaceholder: {
    width: 280,
    height: 200,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  h1: { textAlign: 'center', fontSize: 26, lineHeight: 30, fontWeight: '700' },
  muted: { textAlign: 'center', opacity: 0.7, marginTop: 8 },
  dotsFloating: { position: 'absolute', bottom: 12, right: 16, flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.15)' },
  dotActive: { width: 28, borderRadius: 8, backgroundColor: BLUE },
  bottomCtas: { position: 'absolute', left: 24, right: 24, bottom: 0, gap: 12 },
  primaryBtn: { backgroundColor: BLUE, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '700' },
  loginInline: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginMuted: { opacity: 0.7 },
  loginLink: { color: BLUE, fontWeight: '700' },
  pressed: { opacity: 0.92 },
  pagerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 14 },
  pill: { height: 8, borderRadius: 8 },
  pillActive: { width: 32, backgroundColor: BLUE },
  pillInactive: { width: 8, backgroundColor: 'rgba(0,0,0,0.12)' },
});
