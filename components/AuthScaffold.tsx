import React, { PropsWithChildren, ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

type Props = PropsWithChildren<{
  title: ReactNode | string;
  subtitle?: ReactNode;
  aside?: ReactNode; // Right-side content on wide screens
  /** On mobile, render children without a card container */
  noCardOnMobile?: boolean;
  /** Control vertical alignment on mobile */
  mobileAlign?: 'start' | 'center' | 'end';
  /** On web/wide, render the left content without a card */
  noCardOnWeb?: boolean;
}>; 

export default function AuthScaffold({ title, subtitle, aside, noCardOnMobile = false, mobileAlign = 'start', noCardOnWeb = false, children }: Props) {
  const { width } = useWindowDimensions();
  const isWide = width >= 900;
  const insets = useSafeAreaInsets();

  if (isWide) {
    return (
      <ThemedView style={styles.rootRow}>
        <ScrollView contentContainerStyle={styles.leftCol} showsVerticalScrollIndicator={false}>
          {typeof title === 'string' ? (
            <ThemedText type="title" style={styles.title}>{title}</ThemedText>
          ) : (
            <View style={styles.titleWrap}>{title}</View>
          )}
          {subtitle ? (
            typeof subtitle === 'string' ? (
              <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
            ) : (
              <View style={styles.subtitleWrap}>{subtitle}</View>
            )
          ) : null}
          {noCardOnWeb ? (
            <View style={styles.content}>{children}</View>
          ) : (
            <View style={styles.card}>{children}</View>
          )}
        </ScrollView>
        {aside ? (
          <>
            <View style={styles.vDivider} />
            <View style={styles.rightCol}> {aside} </View>
          </>
        ) : null}
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.rootCol}>
      <ScrollView
        contentContainerStyle={[
          styles.colWrap,
          {
            paddingTop: Math.max(24, insets.top + 24),
            paddingBottom: Math.max(24, insets.bottom + 24),
            justifyContent: mobileAlign === 'end' ? 'flex-end' : mobileAlign === 'center' ? 'center' : 'flex-start',
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {typeof title === 'string' ? (
          <ThemedText type="title" style={styles.title}>{title}</ThemedText>
        ) : (
          <View style={styles.titleWrap}>{title}</View>
        )}
        {subtitle ? (
          typeof subtitle === 'string' ? (
            <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          ) : (
            <View style={styles.subtitleWrap}>{subtitle}</View>
          )
        ) : null}
        {noCardOnMobile ? (
          <View style={styles.content}>{children}</View>
        ) : (
          <View style={styles.card}>{children}</View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  rootRow: { flex: 1, flexDirection: 'row' },
  rootCol: { flex: 1 },
  leftCol: { flexGrow: 1, padding: 24, justifyContent: 'flex-start', maxWidth: 560, width: '100%' },
  rightCol: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.03)' },
  vDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.06)' },
  title: { marginTop: 8, marginBottom: 6 },
  titleWrap: { marginTop: 8, marginBottom: 6 },
  subtitle: { opacity: 0.7, marginBottom: 12 },
  subtitleWrap: { marginBottom: 12 },
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 560,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 1 },
      default: {},
    }),
  },
  content: { gap: 12, alignSelf: 'stretch' },
  colWrap: { flexGrow: 1, padding: 24 },
});
