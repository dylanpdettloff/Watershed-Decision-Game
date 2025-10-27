import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MeterBar({ label, value }: { label: string; value: number }) {
  const clamped = Math.max(0, Math.min(100, value ?? 0));
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(clamped)}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { color: '#c7d2fe', fontSize: 14, fontWeight: '600' },
  value: { color: 'white', fontSize: 14 },
  track: { height: 10, backgroundColor: '#1f2a44', borderRadius: 6, overflow: 'hidden' },
  fill: { height: 10, backgroundColor: '#60a5fa' },
});
