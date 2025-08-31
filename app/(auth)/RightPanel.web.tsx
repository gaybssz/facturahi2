import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
} from 'react-native';

const BLUE = '#2563EB';

export default function RightPanel() {
  const slides = [
    { title: 'Todas tus facturas en un solo lugar', desc: 'Controla tus ventas e simplifica tu facturación sin complicaciones.' },
    { title: 'Envia y cobra más rápido', desc: 'Comparte enlaces de pago e recebe confirmações instantâneas.' },
    { title: 'Organiza tus clientes', desc: 'Mantén historiales y datos siempre a mano y seguros.' },
  ];

  const pageRef = useRef(0);
  const [page, setPage] = useState(0);

  const goTo = (idx: number) => {
    pageRef.current = idx;
    setPage(idx);
  };

  // autoplay
  useEffect(() => {
    const id = setInterval(() => {
      const next = (pageRef.current + 1) % slides.length;
      goTo(next);
    }, 8000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <View style={localStyles.rightPane}>
      <View style={localStyles.wrapper}>
        <View style={localStyles.slideContainer}>
          <ThemedText style={localStyles.slideTitle}>{slides[page].title}</ThemedText>
          <ThemedText style={localStyles.slideDesc}>{slides[page].desc}</ThemedText>
        </View>

        <View style={localStyles.pagerRow}>
          {slides.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => goTo(i)}
              style={[
                localStyles.dot,
                i === page ? localStyles.dotActive : localStyles.dotInactive,
                i < slides.length - 1 && { marginRight: 8 },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  rightPane: {
    flexBasis: 0,
    flexGrow: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE,
    alignSelf: 'stretch',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  wrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingTop: 150 },
  slideContainer: {
    alignItems: 'center',
  },
  slideTitle: { fontSize: 26, lineHeight: 30, fontWeight: '700', color: '#fff', textAlign: 'center' },
  slideDesc: { fontSize: 16, color: '#fff', opacity: 0.85, marginTop: 8, textAlign: 'center' },
  pagerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  dot: { width: 8, height: 8, borderRadius: 999 },
  dotActive: { backgroundColor: '#fff' },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.3)' },
});
