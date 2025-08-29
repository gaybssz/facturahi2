import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import ParallaxTilt from '@/components/ParallaxTilt';

export default function MarketingPanel() {
  return (
    <View style={styles.container}>
      <ParallaxTilt maxTilt={10} style={styles.cardWrapper}>
        <View style={styles.cardLayerShadow} />
        <View style={styles.card} />
      </ParallaxTilt>

      <ThemedText style={styles.kicker}>Toma el control de tus finanzas</ThemedText>
      <ThemedText type="title" style={styles.headline}>
        Una plataforma única para gestionar todos tus movimientos financieros
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  cardWrapper: {
    width: 340,
    height: 200,
    marginBottom: 24,
  },
  cardLayerShadow: {
    ...Platform.select({
      default: {},
      web: {
        boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
      } as any,
    }),
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 20,
  },
  card: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#e9e9ec',
    borderRadius: 20,
  },
  kicker: {
    marginTop: 8,
    opacity: 0.7,
  },
  headline: {
    textAlign: 'center',
    maxWidth: 640,
    marginTop: 8,
  },
});
