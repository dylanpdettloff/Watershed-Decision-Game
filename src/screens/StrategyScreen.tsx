import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { strategies } from '../store/content';
import { useGame } from '../state/GameContext';
import MeterPanel from '../components/MeterPanel';
import { useNavigation } from '@react-navigation/native';

export default function StrategyScreen() {
  const { state, toggleStrategy, finishGame } = useGame();
  const nav = useNavigation<any>();

  const role = state.role;
  const available = strategies.filter(s => !s.roles || (role && s.roles.includes(role)));
  const selected = new Set(state.chosenStrategies);

  const onFinish = () => {
    finishGame();
    nav.navigate('Summary');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Act III — Future Strategies</Text>
      <Text style={styles.sub}>Pick 2–3 interventions for the next 25 years.</Text>

      <MeterPanel />

      <FlatList
        data={available}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggleStrategy(item.id)}
            style={[styles.card, selected.has(item.id) && styles.cardActive]}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
          </Pressable>
        )}
      />

      <Pressable
        disabled={state.chosenStrategies.length < 2}
        onPress={onFinish}
        style={[styles.finish, state.chosenStrategies.length < 2 && { opacity: 0.5 }]}
      >
        <Text style={styles.finishText}>See Outcome Summary →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1326', padding: 16 },
  heading: { color: 'white', fontSize: 20, fontWeight: '800' },
  sub: { color: '#cbd5e1', marginBottom: 10 },
  card: {
    backgroundColor: '#122043',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2a44',
  },
  cardActive: { borderColor: '#60a5fa' },
  title: { color: 'white', fontWeight: '700' },
  summary: { color: '#cbd5e1' },
  finish: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  finishText: { color: 'white', fontWeight: '800' },
});