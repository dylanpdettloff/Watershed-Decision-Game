import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useGame } from '../state/GameContext';
import { scenariosByAct, roleTaglines } from '../store/content';
import MeterPanel from '../components/MeterPanel';
import { useNavigation } from '@react-navigation/native';

export default function ScenarioScreen() {
  const { state, applyOption, goNext, goToStrategies } = useGame();
  const nav = useNavigation<any>();
  const navigated = React.useRef(false);

  // Navigate to Strategy after render if we've advanced to act 2
  React.useEffect(() => {
    if (state.actIndex === 2 && !navigated.current) {
      navigated.current = true;
      // Use replace so Scenario isn't left on the stack
      nav.replace('Strategy');
    }
  }, [state.actIndex, nav]);

  const act = scenariosByAct[state.actIndex];
  const scenario = act?.[state.scenarioIndex];

  // If navigation is about to happen, render nothing
  if (state.actIndex === 2) return null;

  if (!scenario) {
    return (
      <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={styles.title}>Loading scenario…</Text>
        <Pressable style={[styles.option, styles.secondary]} onPress={goToStrategies}>
          <Text style={styles.optLabel}>Skip to Future Strategies →</Text>
        </Pressable>
      </View>
    );
  }

  const role = state.role;
  const visibleOptions = scenario.options.filter(o => !o.roles || (role && o.roles.includes(role)));

  return (
    <View style={styles.container}>
      <Text style={styles.actLabel}>
        Act {state.actIndex === 0 ? 'I — Successes' : 'II — Challenges'}
      </Text>
      {!!role && <Text style={styles.tagline}>{roleTaglines[role]}</Text>}
      <Text style={styles.title}>{scenario.title}</Text>
      <Text style={styles.prompt}>{scenario.prompt}</Text>

      <MeterPanel />

      {visibleOptions.length === 0 ? (
        <View style={[styles.option, styles.secondary]}>
          <Text style={styles.optConsequence}>No options available for this role in this scenario.</Text>
        </View>
      ) : (
        visibleOptions.map((opt) => (
          <Pressable
            key={opt.id}
            style={styles.option}
            onPress={() => {
              applyOption(scenario, opt.id);
              goNext();
            }}
          >
            <Text style={styles.optLabel}>{opt.label}</Text>
            <Text style={styles.optConsequence}>{opt.consequence}</Text>
          </Pressable>
        ))
      )}

      <Pressable style={[styles.option, styles.secondary]} onPress={goToStrategies}>
        <Text style={styles.optLabel}>Skip to Future Strategies →</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1326', padding: 16 },
  actLabel: { color: '#93c5fd', marginBottom: 6, fontWeight: '600' },
  tagline: { color: '#cbd5e1', marginBottom: 6 },
  title: { color: 'white', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  prompt: { color: '#dbeafe', marginBottom: 12 },
  option: {
    backgroundColor: '#122043',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2a44',
  },
  secondary: { backgroundColor: 'transparent' },
  optLabel: { color: 'white', fontWeight: '700' },
  optConsequence: { color: '#cbd5e1' },
});
