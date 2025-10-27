import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGame } from '../state/GameContext';
import MeterBar from './MeterBar';

export default function MeterPanel() {
  const { state } = useGame();
  return (
    <View style={styles.wrap}>
      <MeterBar label="Water Quality" value={state.meters.water} />
      <MeterBar label="Equity" value={state.meters.equity} />
      <MeterBar label="Cost" value={state.meters.cost} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 12, backgroundColor: '#0e1a33', borderRadius: 12, marginVertical: 8 },
});
