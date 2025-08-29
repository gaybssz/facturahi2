import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  width?: number;
  height?: number;
  borderRadius?: number;
  framed?: boolean;
};

// Lightweight, dependency-free animation that mirrors the steps
// of issuing an invoice. Designed for RN Web, no background.
export default function VerifactuAnimationWeb({ width = 500, height = 300, borderRadius = 16, framed = true }: Props) {
  const [step, setStep] = useState(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  useEffect(() => {
    const schedule = [800, 1000, 1200, 1400, 1400, 1600];
    const id = setTimeout(() => setStep((s) => (s + 1) % schedule.length), schedule[Math.min(step, schedule.length - 1)]);
    return () => clearTimeout(id);
  }, [step]);

  const containerStyle = useMemo(
    () => [{ width, height, borderRadius }],
    [width, height, borderRadius]
  );

  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.root, framed ? styles.framed : undefined, ...containerStyle, fade]}> 
      {step <= 1 && <FormScene highlight={step === 1} />}
      {step >= 2 && step <= 3 && <TemplatesScene selected={step === 3} />}
      {step >= 4 && <VerificationScene done={step >= 5} />}
    </Animated.View>
  );
}

function FormScene({ highlight }: { highlight?: boolean }) {
  return (
    <View style={styles.sceneWrap}>
      <View style={[styles.rowBtn, highlight && styles.rowBtnActive]}>
        <Ionicons name="file-tray-outline" size={18} color="#111" />
        <Text style={styles.btnText}>Crear nueva factura</Text>
      </View>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>1. Seleccionar cliente</Text>
        <View style={styles.listItem}>
          <View style={styles.avatar} />
          <Text style={styles.itemText}>Innovate Corp.</Text>
        </View>
        <View style={[styles.listItem, { opacity: 0.6 }]}> 
          <View style={[styles.avatar, { backgroundColor: '#e5e7eb' }]} />
          <Text style={styles.itemText}>Creative Minds</Text>
        </View>
      </View>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>2. Seleccionar producto</Text>
        <View style={styles.listItem}>
          <Ionicons name="cart-outline" size={18} color="#6b7280" />
          <Text style={styles.itemText}>Servicio de Consultoría</Text>
          <Text style={styles.price}>€1,000.00</Text>
        </View>
      </View>
    </View>
  );
}

function TemplatesScene({ selected }: { selected?: boolean }) {
  return (
    <View style={[styles.sceneWrap, { gap: 16 }]}> 
      <View style={styles.templatesRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.thumb, selected && i === 1 ? styles.thumbActive : undefined]} />
        ))}
      </View>
      <View style={[styles.rowBtn, { backgroundColor: '#16a34a' }]}> 
        <Ionicons name="send-outline" size={18} color="#fff" />
        <Text style={[styles.btnText, { color: '#fff' }]}>Emitir VERI*FACTU</Text>
      </View>
    </View>
  );
}

function VerificationScene({ done }: { done?: boolean }) {
  const steps = [
    { text: 'Generando XML (Factura-E)', icon: 'document-text-outline' as const },
    { text: 'Aplicando firma digital', icon: 'finger-print-outline' as const },
    { text: 'Enviando a la Agencia Tributaria', icon: 'send-outline' as const },
  ];
  return (
    <View style={[styles.sceneWrap, { alignItems: 'stretch' }]}> 
      <Text style={styles.verifyTitle}>Procesando Factura...</Text>
      {steps.map((s, idx) => (
        <View key={s.text} style={styles.verifyRow}>
          <View style={[styles.verifyIcon, done || idx === 0 ? styles.verifyOk : undefined]}>
            {done || idx === 0 ? (
              <Ionicons name="checkmark" size={16} color="#fff" />
            ) : (
              <Ionicons name={s.icon} size={16} color="#6b7280" />
            )}
          </View>
          <Text style={[styles.verifyText, done || idx === 0 ? styles.verifyTextMuted : undefined]}>{s.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  framed: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  sceneWrap: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#111',
  },
  rowBtnActive: {
    transform: [{ scale: 1.02 }],
  },
  btnText: { color: '#fff', fontWeight: '600' },
  formCard: {
    alignSelf: 'stretch',
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 10,
    marginTop: 10,
  },
  formTitle: { fontSize: 12, color: '#6b7280', fontWeight: '600', marginBottom: 6 },
  listItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  avatar: { width: 20, height: 20, borderRadius: 20, backgroundColor: '#d1d5db' },
  itemText: { fontSize: 12, color: '#111' },
  price: { marginLeft: 'auto', fontSize: 12, color: '#6b7280' },
  templatesRow: { flexDirection: 'row', gap: 12 },
  thumb: {
    width: 70,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  thumbActive: { borderColor: '#16a34a', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  verifyTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: '#111', textAlign: 'center' },
  verifyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  verifyIcon: { width: 24, height: 24, borderRadius: 24, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  verifyOk: { backgroundColor: '#22c55e' },
  verifyText: { fontSize: 13, color: '#374151' },
  verifyTextMuted: { color: '#9ca3af' },
});
