import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useGame } from '../state/GameContext';
import { strategies } from '../store/content';

const historicalNotes: string[] = [
  '1997 MOA established a partnership among NYC, watershed towns, NYS, and others to protect unfiltered drinking water through collaborative governance.',
  'Land acquisition and conservation easements scaled up to protect sensitive riparian corridors, wetlands, and recharge areas near reservoirs.',
  'The Catskill Watershed Corporation (CWC) administered local programs (e.g., septic rehabilitation, stormwater retrofits, business assistance), improving trust and delivery while managing tensions around land use.',
  'Adaptive reservoir operations and enhanced monitoring reduced delivered turbidity risk during storms while maintaining supply reliability.',
  'Agricultural programs (whole-farm planning, nutrient management, BMPs) were widely adopted in priority basins, reducing sediment and nutrient loads while keeping farms viable.',
  'Growth management combined watershed rules/regs, WWTP upgrades, and site-level stormwater controls; some growth shifted toward hamlet cores, though development pressures persisted.',
  'Equity and cost balance emerged via shared funding (program grants, local infrastructure investments), but benefits and burdens were uneven across communities and sectors.',
  'Overall, collaborative governance sustained the filtration-avoidance determination while iterating on programs as conditions and science evolved.',
];

export default function SummaryScreen() {
  const { state, reset } = useGame();

  const chosen = state.chosenStrategies
    .map((id) => strategies.find((s) => s.id === id)?.title)
    .filter(Boolean)
    .join(', ');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Outcome Summary</Text>

      <View style={styles.panel}>
        <Text style={styles.row}>
          Role: <Text style={styles.bold}>{state.role ?? '—'}</Text>
        </Text>
        <Text style={styles.row}>Water Quality: {Math.round(state.meters.water)}</Text>
        <Text style={styles.row}>Equity: {Math.round(state.meters.equity)}</Text>
        <Text style={styles.row}>Cost: {Math.round(state.meters.cost)}</Text>
      </View>

      <Text style={styles.subhead}>Chosen Strategies</Text>
      <Text style={styles.row}>{chosen || 'None'}</Text>

      <Text style={[styles.subhead, { marginTop: 16 }]}>Reflection Prompt</Text>
      <Text style={styles.paragraph}>
        Connect your decisions to the watershed’s successes and challenges. Why are your
        future strategies appropriate for the next 25 years and how do they balance water quality, equity,
        and cost?
      </Text>

      <Text style={[styles.subhead, { marginTop: 20 }]}>Historical Context (for comparison)</Text>
      <View style={styles.historyPanel}>
        {historicalNotes.map((line, idx) => (
          <Text key={idx} style={styles.bullet}>
            • {line}
          </Text>
        ))}
        <Text style={[styles.note, { marginTop: 8 }]}>
          Note: This is a brief, non-exhaustive overview to support learning. For precise details and dates,
          refer to your course readings and primary sources.
        </Text>
      </View>

      <Pressable onPress={reset} style={styles.again}>
        <Text style={styles.againText}>Play Again</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1326', padding: 16 },
  title: { color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  panel: { backgroundColor: '#0e1a33', borderRadius: 12, padding: 12, marginBottom: 12 },
  row: { color: '#dbeafe', marginBottom: 4 },
  bold: { color: 'white', fontWeight: '800' },
  subhead: { color: '#93c5fd', fontWeight: '700', marginBottom: 6 },
  paragraph: { color: '#dbeafe', lineHeight: 20 },
  historyPanel: { backgroundColor: '#0e1a33', borderRadius: 12, padding: 12 },
  bullet: { color: '#dbeafe', marginBottom: 6, lineHeight: 20 },
  note: { color: '#94a3b8', fontStyle: 'italic' },
  again: { backgroundColor: '#2563eb', padding: 12, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  againText: { color: 'white', fontWeight: '800' },
});